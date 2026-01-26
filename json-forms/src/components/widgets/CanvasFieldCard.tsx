import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { GripVertical, Pencil, Trash2, Check } from 'lucide-react'
import { useState } from 'react'
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

	// Auto-expand if the field was created very recently (< 2s ago)
	const [isEditing, setIsEditing] = useState(() => {
		try {
			const parts = field.id.split('_')
			const timestamp = parseInt(parts[parts.length - 1], 16)
			return Date.now() - timestamp < 2000
		} catch {
			return false
		}
	})

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
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3 min-w-0 overflow-hidden">
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
					
					<div className="min-w-0 pr-2">
						<div className="flex items-center gap-2">
							<span className="text-sm font-bold text-slate-800 truncate">
								{field.title || field.name}
							</span>
							{field.required && (
								<span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600">
									Req
								</span>
							)}
						</div>
						<div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
							<span className="text-[#42855B]">{template?.label || field.kind}</span>
							<span>•</span>
							<span className="font-mono">{field.name}</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-1 shrink-0">
					{!isEditing && (
						<button
							onClick={() => setIsEditing(true)}
							className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-[#42855B] transition-colors"
							title="Edit Field"
						>
							<Pencil size={16} />
						</button>
					)}
					<button
						onClick={onRemove}
						className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
						title="Remove Field"
					>
						<Trash2 size={16} />
					</button>
				</div>
			</div>

			{isEditing && (
				<div className="mt-4 border-t border-slate-100/80 pt-4 animate-in slide-in-from-top-2 fade-in duration-200">
					<div className="grid grid-cols-2 gap-4">
						<label className="col-span-2 sm:col-span-1 grid gap-1.5 text-xs font-semibold text-slate-600">
							<span>Field ID (Name)</span>
							<input
								className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B] transition-all"
								value={field.name}
								onChange={(e) => onChange({ name: e.target.value })}
								placeholder="e.g. firstName"
							/>
						</label>
						<label className="col-span-2 sm:col-span-1 grid gap-1.5 text-xs font-semibold text-slate-600">
							<span>Display Label</span>
							<input
								className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B] transition-all"
								value={field.title}
								onChange={(e) => onChange({ title: e.target.value })}
								placeholder="What the user sees"
							/>
						</label>
						
						<label className="col-span-2 grid gap-1.5 text-xs font-semibold text-slate-600">
							<span>Description / Help Text</span>
							<input
								className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B] transition-all"
								value={field.description || ''}
								onChange={(e) => onChange({ description: e.target.value })}
								placeholder="Explain this field..."
							/>
						</label>

						{['string', 'textarea', 'email', 'url', 'password', 'number', 'integer'].includes(field.kind) && (
							<label className="col-span-2 grid gap-1.5 text-xs font-semibold text-slate-600">
								<span>Placeholder</span>
								<input
									className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B] transition-all"
									value={field.placeholder || ''}
									onChange={(e) => onChange({ placeholder: e.target.value })}
									placeholder="Placeholder text"
								/>
							</label>
						)}

						{/* String Validation */}
						{['string', 'textarea', 'email', 'url', 'password'].includes(field.kind) && (
							<>
								<label className="grid gap-1.5 text-xs font-semibold text-slate-600">
									<span>Min Length</span>
									<input
										type="number"
										className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B] transition-all"
										value={field.minLength ?? ''}
										onChange={(e) => onChange({ minLength: e.target.value ? parseInt(e.target.value) : undefined })}
									/>
								</label>
								<label className="grid gap-1.5 text-xs font-semibold text-slate-600">
									<span>Max Length</span>
									<input
										type="number"
										className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B] transition-all"
										value={field.maxLength ?? ''}
										onChange={(e) => onChange({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
									/>
								</label>
							</>
						)}

						{/* Number Validation */}
						{['number', 'integer'].includes(field.kind) && (
							<>
								<label className="grid gap-1.5 text-xs font-semibold text-slate-600">
									<span>Minimum</span>
									<input
										type="number"
										className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B] transition-all"
										value={field.minimum ?? ''}
										onChange={(e) => onChange({ minimum: e.target.value ? parseFloat(e.target.value) : undefined })}
									/>
								</label>
								<label className="grid gap-1.5 text-xs font-semibold text-slate-600">
									<span>Maximum</span>
									<input
										type="number"
										className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B] transition-all"
										value={field.maximum ?? ''}
										onChange={(e) => onChange({ maximum: e.target.value ? parseFloat(e.target.value) : undefined })}
									/>
								</label>
							</>
						)}

						<div className="col-span-2 flex items-center gap-3 rounded-xl border border-slate-200 p-3 bg-slate-50/50">
							<div className="flex items-center h-5">
								<input
									type="checkbox"
									id={`req-${field.id}`}
									checked={field.required}
									onChange={(e) => onChange({ required: e.target.checked })}
									className="h-4 w-4 rounded border-slate-300 text-[#42855B] focus:ring-[#42855B]"
								/>
							</div>
							<label htmlFor={`req-${field.id}`} className="text-sm text-slate-700 font-medium select-none cursor-pointer">
								Required Field
							</label>
						</div>

						{/* Enum Field Options */}
						{(field.kind === 'select' || field.kind === 'radio' || field.kind === 'multiselect') && (
							<label className="col-span-2 grid gap-1.5 text-xs font-semibold text-slate-600">
								<span>Options (one per line)</span>
								<textarea
									className="min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B] transition-all"
									value={enumToText(field.enumValues)}
									onChange={(e) => onChange({ enumValues: textToEnum(e.target.value) })}
									placeholder="Option 1&#10;Option 2&#10;Option 3"
								/>
								{field.kind === 'multiselect' && (
									<div className="text-[11px] text-slate-500 font-medium pt-1">Returns array of strings</div>
								)}
							</label>
						)}

					</div>

					<div className="mt-5 flex justify-end">
						<button
							onClick={() => setIsEditing(false)}
							className="flex items-center gap-2 rounded-xl bg-[#42855B] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#42855B]/20 hover:bg-[#36704b] hover:shadow-[#42855B]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
						>
							<Check size={16} strokeWidth={3} />
							Done
						</button>
					</div>
				</div>
			)}
		</div>
	)
}


