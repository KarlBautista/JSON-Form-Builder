import {
	DndContext,
	DragOverlay,
	PointerSensor,
	closestCenter,
	useDroppable,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { useEffect, useMemo, useState } from 'react'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Form from '@rjsf/mui'
import type { RJSFSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import { FIELD_PALETTE, type FieldTemplate } from '../schemas/fieldPalette'
import { useSchemaBuilder } from './hooks/useSchemaBuilder'
import CanvasFieldCard from './widgets/CanvasFieldCard'
import FormDataPanel from './widgets/FormDataPanel'
import JsonSchemaPanel from './widgets/JsonSchemaPanel'
import PaletteCard from './widgets/PaletteCard'
import UiSchemaPanel from './widgets/UiSchemaPanel'

const muiDarkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
	shape: {
		borderRadius: 14,
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					backgroundColor: 'rgba(2, 6, 23, 0.35)',
					border: '1px solid rgba(255, 255, 255, 0.10)',
					backdropFilter: 'blur(16px)',
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					backgroundColor: 'rgba(2, 6, 23, 0.25)',
					borderRadius: 14,
				},
			},
		},
	},
})

function CanvasDropZone({ children }: { children: React.ReactNode }) {
	const { setNodeRef, isOver } = useDroppable({ id: 'canvas' })
	return (
		<div
			ref={setNodeRef}
			className={
				'max-h-[60vh] min-h-[240px] overflow-auto rounded-2xl border border-dashed p-3 transition ' +
				(isOver ? 'border-cyan-300/70 bg-white/5' : 'border-white/15 bg-white/5')
			}
		>
			{children}
		</div>
	)
}

export default function SchemaBuilder() {
	const { title, setTitle, fields, schema, uiSchema, validation, addFromTemplate, updateField, removeField, moveField } =
		useSchemaBuilder()
	const [activeOverlayLabel, setActiveOverlayLabel] = useState<string | null>(null)
	const [uiSchemaText, setUiSchemaText] = useState<string>(() => JSON.stringify(uiSchema, null, 2))
	const [uiSchemaDirty, setUiSchemaDirty] = useState(false)
	const [liveFormData, setLiveFormData] = useState<unknown>(null)
	const [submittedFormData, setSubmittedFormData] = useState<unknown>(null)

	useEffect(() => {
		if (!uiSchemaDirty) setUiSchemaText(JSON.stringify(uiSchema, null, 2))
	}, [uiSchema, uiSchemaDirty])

	const uiSchemaParse = useMemo(() => {
		try {
			const parsed = JSON.parse(uiSchemaText)
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
				return { ok: false as const, error: 'uiSchema must be a JSON object.' }
			}
			return { ok: true as const, value: parsed }
		} catch (e) {
			return { ok: false as const, error: e instanceof Error ? e.message : 'Invalid JSON.' }
		}
	}, [uiSchemaText])

	const uiSchemaForPreview = (uiSchemaParse.ok ? (uiSchemaParse.value as any) : uiSchema) as any

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

	function handleDragStart(event: DragStartEvent) {
		const from = event.active?.data?.current?.from as 'palette' | 'canvas' | undefined
		if (from === 'palette') {
			const template = event.active?.data?.current?.template as FieldTemplate | undefined
			setActiveOverlayLabel(template?.label ?? 'Component')
			return
		}
		if (from === 'canvas') {
			const id = event.active?.id
			const field = typeof id === 'string' ? fields.find((f) => f.id === id) : undefined
			setActiveOverlayLabel(field?.title || field?.name || 'Field')
			return
		}
		setActiveOverlayLabel(null)
	}

	function handleDragCancel() {
		setActiveOverlayLabel(null)
	}

	function handleDragEnd(event: DragEndEvent) {
		setActiveOverlayLabel(null)
		const { active, over } = event
		if (!over) return

		const from = active.data.current?.from as 'palette' | 'canvas' | undefined

		const isOverCanvas = over.id === 'canvas' || fields.some((f) => f.id === over.id)
		if (from === 'palette' && isOverCanvas) {
			const template = active.data.current?.template as FieldTemplate | undefined
			if (template) addFromTemplate(template)
			return
		}

		if (from === 'canvas') {
			if (typeof active.id === 'string' && typeof over.id === 'string') {
				if (active.id !== over.id) moveField(active.id, over.id)
			}
		}
	}

	const overlayNode = useMemo(() => {
		if (!activeOverlayLabel) return null
		return (
			<div className="pointer-events-none transform-gpu rounded-2xl border border-white/15 bg-slate-950/80 px-3 py-2 text-sm font-semibold text-slate-50 shadow-lg">
				{activeOverlayLabel}
			</div>
		)
	}, [activeOverlayLabel])

	const schemaForPreview: RJSFSchema = schema

	return (
		<div className="min-h-screen">
			<div className="mx-auto max-w-[1400px] p-4 lg:p-6">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_25px_80px_-60px_rgba(59,130,246,0.65)] backdrop-blur-xl lg:p-5">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex items-start gap-3">
							<div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 ring-1 ring-white/10">
								<div className="h-6 w-6 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500" />
							</div>
							<div>
								<h1 className="text-lg font-extrabold tracking-tight text-slate-50 lg:text-xl">JSON Schema Form Builder</h1>
								<p className="mt-0.5 text-sm text-slate-300">Drag components into the canvas. The schema updates live.</p>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<div className="text-xs text-slate-300">
								<span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">Fields: {fields.length}</span>
							</div>
							<button
								type="button"
								disabled={!validation.isValid}
								onClick={() => {
									console.log('Generated JSON Schema:', schema)
									console.log(JSON.stringify(schema, null, 2))
								}}
								className={
									'rounded-2xl px-4 py-2 text-sm font-extrabold tracking-tight transition ' +
									(!validation.isValid
										? 'cursor-not-allowed border border-white/10 bg-white/5 text-slate-400'
										: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_12px_40px_-20px_rgba(34,211,238,0.85)] hover:brightness-110')
								}
							>
								Submit (console.log schema)
							</button>
						</div>
					</div>
				</div>

				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragCancel={handleDragCancel}
					onDragEnd={handleDragEnd}
				>
					<div className="mt-4 grid grid-cols-12 gap-4">

						<div className="col-span-12 lg:col-span-3">
							<div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.85)] backdrop-blur-xl">
								<div className="mt-4">
									<label className="mb-5 grid gap-1 text-xs text-slate-300">
										<span className="font-semibold">Schema title</span>
										<input
											className="rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											placeholder="e.g. Registration"
										/>
									</label>
								</div>
								<h2 className="text-sm font-extrabold tracking-tight text-slate-50">Components</h2>
								<div className="mt-3 grid gap-2">
									{FIELD_PALETTE.map((t) => (
										<PaletteCard key={t.kind} template={t} />
									))}
								</div>

							</div>
						</div>

						{/* Center: Canvas + Preview */}
						<div className="col-span-12 lg:col-span-6">
							<div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.85)] backdrop-blur-xl">
								<div className="flex items-center justify-between gap-3">
									<h2 className="text-sm font-extrabold tracking-tight text-slate-50">Canvas</h2>
									<div className="text-xs text-slate-300">Drag to reorder</div>
								</div>

								<div className="mt-3">
									<CanvasDropZone>
										{fields.length === 0 ? (
											<div className="grid place-items-center py-12 text-center">
												<div>
													<div className="text-sm font-semibold text-slate-100">Drop components here</div>
													<div className="text-xs text-slate-300">Then edit name/title/required</div>
												</div>
											</div>
										) : (
											<SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
												<div className="grid gap-3">
													{fields.map((f) => (
														<CanvasFieldCard
															key={f.id}
															field={f}
															onChange={(patch) => updateField(f.id, patch)}
															onRemove={() => removeField(f.id)}
														/>
													))}
												</div>
											</SortableContext>
										)}
									</CanvasDropZone>
								</div>
							</div>

							<div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.85)] backdrop-blur-xl">
								<div className="flex items-center justify-between">
									<h2 className="text-sm font-extrabold tracking-tight text-slate-50">Live Preview</h2>
									<div className="text-xs text-slate-300">RJSF render</div>
								</div>
								<div className="mt-3 max-h-[60vh] overflow-auto pr-1">
									<ThemeProvider theme={muiDarkTheme}>
										<Form
											schema={schemaForPreview}
											uiSchema={uiSchemaForPreview}
											validator={validator}
											onChange={({ formData }) => setLiveFormData(formData)}
											onSubmit={({ formData }) => {
												setSubmittedFormData(formData)
												console.log('Preview form submit:', formData)
											}}
										/>
									</ThemeProvider>
								</div>
							</div>
						</div>

						{/* Right: JSON Schema */}
						<div className="col-span-12 lg:col-span-3">
							<div className="grid gap-4">
								<JsonSchemaPanel schema={schema} errors={validation.errors} />
								<UiSchemaPanel
									uiSchemaText={uiSchemaText}
									parseError={uiSchemaParse.ok ? null : uiSchemaParse.error}
									isDirty={uiSchemaDirty}
									onChangeText={(next) => {
										setUiSchemaDirty(true)
										setUiSchemaText(next)
									}}
									onResetToAuto={() => {
										setUiSchemaDirty(false)
										setUiSchemaText(JSON.stringify(uiSchema, null, 2))
									}}
								/>
								<FormDataPanel liveFormData={liveFormData} submittedFormData={submittedFormData} />
							</div>
						</div>
					</div>
					<DragOverlay dropAnimation={null}>{overlayNode}</DragOverlay>
				</DndContext>
			</div>
		</div>
	)
}
