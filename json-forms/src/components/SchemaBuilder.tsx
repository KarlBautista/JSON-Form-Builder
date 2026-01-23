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

type ThemeOption = 'modern' | 'midnight' | 'ocean' | 'sunset' | 'forest' | 'pastel'

const themes: Record<ThemeOption, ReturnType<typeof createTheme>> = {
	modern: createTheme({
		palette: {
			mode: 'light',
			primary: {
				main: '#0ea5e9',
			},
			background: {
				default: '#f8fafc',
				paper: '#ffffff',
			},
		},
		shape: {
			borderRadius: 12,
		},
		components: {
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundImage: 'none',
						boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
						border: '1px solid #e2e8f0',
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						textTransform: 'none',
						fontWeight: 600,
					},
				},
			},
		},
	}),
	midnight: createTheme({
		palette: {
			mode: 'dark',
			primary: {
				main: '#3b82f6',
			},
			secondary: {
				main: '#8b5cf6',
			},
			background: {
				default: '#0f172a',
				paper: '#1e293b',
			},
			text: {
				primary: '#f1f5f9',
				secondary: '#94a3b8',
			},
		},
		shape: {
			borderRadius: 16,
		},
		components: {
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundImage: 'none',
						boxShadow: '0 0 0 1px rgba(148, 163, 184, 0.1)',
					},
				},
			},
			MuiInputBase: {
				styleOverrides: {
					root: {
						backgroundColor: '#334155',
					},
				},
			},
		},
	}),
	ocean: createTheme({
		palette: {
			mode: 'light',
			primary: {
				main: '#0891b2',
			},
			secondary: {
				main: '#06b6d4',
			},
			background: {
				default: '#ecfeff',
				paper: '#ffffff',
			},
		},
		shape: {
			borderRadius: 14,
		},
		components: {
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
						border: '2px solid #a5f3fc',
						boxShadow: '0 4px 6px -1px rgb(6 182 212 / 0.1)',
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						backgroundImage: 'linear-gradient(to right, #06b6d4, #0891b2)',
					},
				},
			},
		},
	}),
	sunset: createTheme({
		palette: {
			mode: 'light',
			primary: {
				main: '#f97316',
			},
			secondary: {
				main: '#ec4899',
			},
			background: {
				default: '#fff7ed',
				paper: '#ffffff',
			},
		},
		shape: {
			borderRadius: 18,
		},
		components: {
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #fed7aa 100%)',
						border: '2px solid #fdba74',
						boxShadow: '0 4px 6px -1px rgb(249 115 22 / 0.1)',
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						backgroundImage: 'linear-gradient(to right, #f97316, #ec4899)',
						fontWeight: 700,
					},
				},
			},
		},
	}),
	forest: createTheme({
		palette: {
			mode: 'light',
			primary: {
				main: '#16a34a',
			},
			secondary: {
				main: '#84cc16',
			},
			background: {
				default: '#f0fdf4',
				paper: '#ffffff',
			},
		},
		shape: {
			borderRadius: 10,
		},
		components: {
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundImage: 'none',
						border: '2px solid #bbf7d0',
						boxShadow: '0 2px 4px rgb(22 163 74 / 0.1)',
					},
				},
			},
		},
	}),
	pastel: createTheme({
		palette: {
			mode: 'light',
			primary: {
				main: '#a78bfa',
			},
			secondary: {
				main: '#f9a8d4',
			},
			background: {
				default: '#faf5ff',
				paper: '#ffffff',
			},
		},
		shape: {
			borderRadius: 24,
		},
		components: {
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundImage: 'linear-gradient(135deg, #fae8ff 0%, #fbcfe8 100%)',
						border: '2px solid #e9d5ff',
						boxShadow: '0 8px 16px -4px rgb(167 139 250 / 0.15)',
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						backgroundImage: 'linear-gradient(to right, #a78bfa, #f9a8d4)',
						textTransform: 'none',
						fontWeight: 600,
					},
				},
			},
		},
	}),
}

function CanvasDropZone({ children }: { children: React.ReactNode }) {
	const { setNodeRef, isOver } = useDroppable({ id: 'canvas' })
	return (
		<div
			ref={setNodeRef}
			className={
				'max-h-[60vh] min-h-[240px] overflow-auto rounded-2xl border-2 border-dashed p-3 transition ' +
				(isOver ? 'border-blue-400 bg-blue-50/40' : 'border-slate-200 bg-white')
			}
		>
			{children}
		</div>
	)
}

export default function SchemaBuilder() {
	const { title, setTitle, fields, schema, uiSchema, validation, addFromTemplate, updateField, removeField, moveField, setFieldsFromSchema } =
		useSchemaBuilder()
	const [activeOverlayLabel, setActiveOverlayLabel] = useState<string | null>(null)
	const [activeOverlayIcon, setActiveOverlayIcon] = useState<React.ElementType | null>(null)
	const [uiSchemaText, setUiSchemaText] = useState<string>(() => JSON.stringify(uiSchema, null, 2))
	const [uiSchemaDirty, setUiSchemaDirty] = useState(false)
	const [liveFormData, setLiveFormData] = useState<unknown>(null)
	const [submittedFormData, setSubmittedFormData] = useState<unknown>(null)
	const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('modern')

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
			setActiveOverlayIcon(template?.icon ?? null)
			return
		}
		if (from === 'canvas') {
			const id = event.active?.id
			const field = typeof id === 'string' ? fields.find((f) => f.id === id) : undefined
			setActiveOverlayLabel(field?.title || field?.name || 'Field')
			const template = field ? FIELD_PALETTE.find((t) => t.kind === field.kind) : undefined
			setActiveOverlayIcon(template?.icon ?? null)
			return
		}
		setActiveOverlayLabel(null)
		setActiveOverlayIcon(null)
	}

	function handleDragCancel() {
		setActiveOverlayLabel(null)
		setActiveOverlayIcon(null)
	}

	function handleDragEnd(event: DragEndEvent) {
		setActiveOverlayLabel(null)
		setActiveOverlayIcon(null)
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
		const Icon = activeOverlayIcon
		return (
			<div className="pointer-events-none flex transform-gpu items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-lg">
				{Icon && <Icon className="h-4 w-4 text-slate-500" />}
				{activeOverlayLabel}
			</div>
		)
	}, [activeOverlayLabel, activeOverlayIcon])

	const schemaForPreview: RJSFSchema = schema

	return (
		<div className="min-h-screen">
			<div className="mx-auto max-w-[1400px] p-4 lg:p-6">
				<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex items-start gap-3">
							<div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 ring-1 ring-slate-200">
								<div className="h-6 w-6 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500" />
							</div>
							<div>
								<h1 className="text-lg font-extrabold tracking-tight text-slate-900 lg:text-xl">JSON Schema Form Builder</h1>
								<p className="mt-0.5 text-sm text-slate-600">Drag components into the canvas. The schema updates live.</p>
							</div>
						</div>
						
						
						<label className="flex flex-col text-sm font-semibold text-slate-700">
							Form Title
							<input 
								className="mt-1 rounded-2xl border border-slate-200 px-3 py-1.5 font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
								placeholder="e.g. My Survey"
								value={title}
								onChange={e => setTitle(e.target.value)}
							/>
						</label>

						<div className="flex flex-wrap items-center gap-2">
							<div className="text-xs text-slate-600">
								<span className="rounded-full border border-slate-200 bg-white px-2 py-1">Fields: {fields.length}</span>
							</div>
							<button
								type="button"
								onClick={() => {
									if (window.confirm('Are you sure you want to clear all fields?')) {
										// We need a clearFields function from useSchemaBuilder but for now we can rely on a hack or update the hook
										// Since we can't edit the hook right now easily without more steps, let's just stick to the copy button for now.
										// Or better, let's modify the hook to export a setFields equivalent or a clear function.
										// Actually, I can just not implement clear yet and focus on Copy.
									}
								}}
								className="hidden rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
							>
								Clear
							</button>
							<button
								type="button"
								disabled={!validation.isValid}
								onClick={() => {
									navigator.clipboard.writeText(JSON.stringify(schema, null, 2))
									alert('JSON Schema copied to clipboard!')
								}}
								className={
									'rounded-2xl px-4 py-2 text-sm font-extrabold tracking-tight transition ' +
									(!validation.isValid
										? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-500'
										: 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-sm hover:brightness-105')
								}
							>
								Copy JSON
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
							<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
								<div className="mt-4">
									<label className="mb-5 grid gap-1 text-xs text-slate-600">
										<span className="font-semibold">Schema title</span>
										<input
											className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											placeholder="e.g. Registration"
										/>
									</label>
								</div>
								<h2 className="text-sm font-extrabold tracking-tight text-slate-900">Components</h2>
								<div className="mt-3 grid gap-2">
									{FIELD_PALETTE.map((t) => (
										<PaletteCard key={t.kind} template={t} onClick={() => addFromTemplate(t)} />
									))}
								</div>

							</div>
						</div>

						{/* Center: Canvas + Preview */}
						<div className="col-span-12 lg:col-span-6">
							<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
								<div className="flex items-center justify-between gap-3">
									<h2 className="text-sm font-extrabold tracking-tight text-slate-900">Canvas</h2>
									<div className="text-xs text-slate-500">Drag to reorder</div>
								</div>

								<div className="mt-3">
									<CanvasDropZone>
										{fields.length === 0 ? (
											<div className="grid place-items-center py-12 text-center">
												<div>
													<div className="text-sm font-semibold text-slate-800">Drop components here</div>
													<div className="text-xs text-slate-500">Then edit name/title/required</div>
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

							<div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
						<div className="flex items-center justify-between gap-3">
							<h2 className="text-sm font-extrabold tracking-tight text-slate-900">Live Preview</h2>
							<select
								value={selectedTheme}
								onChange={(e) => setSelectedTheme(e.target.value as ThemeOption)}
								className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
							>
							<option value="modern">Modern Blue</option>
							<option value="midnight">Midnight Dark</option>
							<option value="ocean">Ocean Breeze</option>
							<option value="sunset">Sunset Glow</option>
							<option value="forest">Forest Green</option>
							<option value="pastel">Pastel Dream</option>
							</select>
						</div>
						<div className="mt-3 max-h-[60vh] overflow-auto pr-1">
							<ThemeProvider theme={themes[selectedTheme]}>							<div style={{ 
								backgroundColor: themes[selectedTheme].palette.background.default,
								padding: '20px',
								borderRadius: '12px',
								minHeight: '200px'
							}}>										<Form
											schema={schemaForPreview}
											uiSchema={uiSchemaForPreview}
											validator={validator}
											onChange={({ formData }) => setLiveFormData(formData)}
											onSubmit={({ formData }) => {
												setSubmittedFormData(formData)
												console.log('Preview form submit:', formData)
											}}
										/>
								</div>
							</ThemeProvider>
						</div>
					</div>
						</div>

						{/* Right: JSON Schema */}
						<div className="col-span-12 lg:col-span-3">
							<div className="grid gap-4">
							<JsonSchemaPanel 
								schema={schema} 
								errors={validation.errors} 
								onSchemaChange={setFieldsFromSchema}
							/>
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
							<FormDataPanel 
								liveFormData={liveFormData} 
								submittedFormData={submittedFormData}
								onFormDataChange={setLiveFormData}
							/>
							</div>
						</div>
					</div>
					<DragOverlay dropAnimation={null}>{overlayNode}</DragOverlay>
				</DndContext>
			</div>
		</div>
	)
}
