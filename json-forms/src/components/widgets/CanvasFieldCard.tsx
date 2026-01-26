import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { GripVertical } from 'lucide-react'
import type { BuilderField } from '../hooks/useSchemaBuilder'
import { FIELD_PALETTE } from '../../schemas/fieldPalette'

type Props = {
	field: BuilderField
	onChange: (patch: Partial<BuilderField>) => void
	onRemove: () => void
}

function enumToText(values: string[] | undefined): string {
	return (values ?? []).join('\n')
}

function textToEnum(text: string): string[] {
	// NOTE: Do not drop empty lines here.
	// If we filter empties, pressing Enter creates a newline that immediately disappears
	// because we round-trip textarea -> enum array -> textarea.
	// The schema generator already filters empty enum values before emitting JSON schema.
	return text.split(/\r?\n/)
}

export default function CanvasFieldCard({ field, onChange, onRemove }: Props) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: field.id,
		data: { from: 'canvas' },
	})

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition: isDragging ? 'none' : transition,
	}

	const template = FIELD_PALETTE.find((t) => t.kind === field.kind)
	const Icon = template?.icon

		return (
		<div
			ref={setNodeRef}
			style={style}
			className={
				'relative transform-gpu will-change-transform rounded-xl border bg-white p-4 transition-all duration-200 ' +
				(isDragging 
					? 'z-50 border-[#42855B]/50 opacity-90 shadow-2xl ring-2 ring-[#42855B] scale-105' 
					: 'border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md')
			}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					<div className="mb-3 flex items-center gap-3">
						<button
							type="button"
							className="cursor-grab p-1 text-stone-400 hover:text-stone-600 active:cursor-grabbing"
							{...listeners}
							{...attributes}
							title="Drag to reorder"
						>
							<GripVertical size={16} />
						</button>
						{Icon && (
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#42855B] text-white shadow-sm ring-1 ring-[#42855B]/20">
								<Icon size={16} />
							</div>
						)}
						<div>
							<div className="text-sm font-semibold text-stone-900 truncate">{field.title || field.name}</div>
							<div className="text-[10px] font-medium uppercase tracking-wider text-[#42855B]">
								{template?.label || field.kind}
							</div>
						</div>
					</div>
					<div className="mt-2 grid grid-cols-2 gap-2">
						<label className="grid gap-1 text-xs text-stone-600">
							<span className="font-semibold">Name</span>
							<input
								className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B]"
								value={field.name}
								onChange={(e) => onChange({ name: e.target.value })}
								placeholder="e.g. firstName"
							/>
						</label>
						<label className="grid gap-1 text-xs text-stone-600">
							<span className="font-semibold">Title</span>
							<input
								className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B]"
								value={field.title}
								onChange={(e) => onChange({ title: e.target.value })}
								placeholder="Shown to users"
							/>
						</label>
					</div>

					<div className="mt-2">
						<label className="grid gap-1 text-xs text-stone-600">
							<span className="font-semibold">Description (Help Text)</span>
							<input
								className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B]"
								value={field.description || ''}
								onChange={(e) => onChange({ description: e.target.value })}
								placeholder="Small help text below the field"
							/>
						</label>
					</div>

					{['string', 'textarea', 'email', 'url', 'password', 'number', 'integer'].includes(field.kind) && (
						<div className="mt-2">
							<label className="grid gap-1 text-xs text-stone-600">
								<span className="font-semibold">Placeholder</span>
								<input
									className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
									value={field.placeholder || ''}
									onChange={(e) => onChange({ placeholder: e.target.value })}
									placeholder="Placeholder text"
								/>
							</label>
						</div>
					)}

					{/* String Validation */}
					{['string', 'textarea', 'email', 'url', 'password'].includes(field.kind) && (
						<div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
							<label className="grid gap-1 text-xs text-stone-600">
								<span className="font-semibold">Min Length</span>
								<input
									type="number"
									className="w-full rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
									value={field.minLength ?? ''}
									onChange={(e) =>
										onChange({ minLength: e.target.value ? parseInt(e.target.value) : undefined })
									}
								/>
							</label>
							<label className="grid gap-1 text-xs text-stone-600">
								<span className="font-semibold">Max Length</span>
								<input
									type="number"
									className="w-full rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
									value={field.maxLength ?? ''}
									onChange={(e) =>
										onChange({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })
									}
								/>
							</label>
							<label className="grid gap-1 text-xs text-stone-600">
								<span className="font-semibold">Pattern (Regex)</span>
								<input
									className="w-full rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
									value={field.pattern || ''}
									onChange={(e) => onChange({ pattern: e.target.value || undefined })}
									placeholder="^expr$"
								/>
							</label>
						</div>
					)}

					{/* Number Validation */}
					{['number', 'integer'].includes(field.kind) && (
						<div className="mt-2 grid grid-cols-2 gap-2">
							<label className="grid gap-1 text-xs text-stone-600">
								<span className="font-semibold">Minimum</span>
								<input
									type="number"
									className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
									value={field.minimum ?? ''}
									onChange={(e) =>
										onChange({ minimum: e.target.value ? parseFloat(e.target.value) : undefined })
									}
								/>
							</label>
							<label className="grid gap-1 text-xs text-stone-600">
								<span className="font-semibold">Maximum</span>
								<input
									type="number"
									className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
									value={field.maximum ?? ''}
									onChange={(e) =>
										onChange({ maximum: e.target.value ? parseFloat(e.target.value) : undefined })
									}
								/>
							</label>
						</div>
					)}

					<div className="mt-2 flex items-center justify-between">
						<label className="flex items-center gap-2 text-sm text-stone-700">
							<input
								type="checkbox"
								checked={field.required}
								onChange={(e) => onChange({ required: e.target.checked })}
							/>
							Required
						</label>
					</div>

					{field.kind === 'select' ? (
						<div className="mt-2">
							<label className="grid gap-1 text-xs text-stone-600">
								<span className="font-semibold">Options (one per line)</span>
								<textarea
									className="min-h-[88px] rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
									value={enumToText(field.enumValues)}
									onChange={(e) => onChange({ enumValues: textToEnum(e.target.value) })}
								/>
							</label>
						</div>
					) : null}

					{field.kind === 'radio' || field.kind === 'multiselect' ? (
						<div className="mt-2">
							<label className="grid gap-1 text-xs text-stone-600">
								<span className="font-semibold">Options (one per line)</span>
								<textarea
									className="min-h-[88px] rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
									value={enumToText(field.enumValues)}
									onChange={(e) => onChange({ enumValues: textToEnum(e.target.value) })}
								/>
								{field.kind === 'multiselect' ? (
									<div className="mt-1 text-[11px] text-stone-500">Multi-select returns an array of strings.</div>
								) : null}
							</label>
						</div>
					) : null}
				</div>

				<button
					type="button"
					onClick={onRemove}
					className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
				>
					Remove
				</button>
			</div>
		</div>
	)
}


