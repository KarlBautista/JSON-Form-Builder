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
	return text.split(/\r?\n/).map((v) => v.trim())
}

export default function CanvasFieldCard({ field, onChange, onRemove }: Props) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: field.id,
		data: { from: 'canvas' },
	})

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	const template = FIELD_PALETTE.find((t) => t.kind === field.kind)
	const Icon = template?.icon

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={
				'transform-gpu will-change-transform rounded-2xl border border-slate-200 bg-white p-3 shadow-sm ' +
				(isDragging ? 'opacity-80 ring-2 ring-sky-200' : '')
			}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<div className="mb-3 flex items-center gap-3">
						<button
							type="button"
							className="cursor-grab p-1 text-slate-400 hover:text-slate-600 active:cursor-grabbing"
							{...listeners}
							{...attributes}
							title="Drag to reorder"
						>
							<GripVertical size={16} />
						</button>
						{Icon && (
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
								<Icon size={16} />
							</div>
						)}
						<div>
							<div className="text-sm font-semibold text-slate-900 truncate">{field.title || field.name}</div>
							<div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
								{template?.label || field.kind}
							</div>
						</div>
					</div>
					<div className="mt-2 grid grid-cols-2 gap-2">
						<label className="grid gap-1 text-xs text-slate-600">
							<span className="font-semibold">Name</span>
							<input
								className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
								value={field.name}
								onChange={(e) => onChange({ name: e.target.value })}
								placeholder="e.g. firstName"
							/>
						</label>
						<label className="grid gap-1 text-xs text-slate-600">
							<span className="font-semibold">Title</span>
							<input
								className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
								value={field.title}
								onChange={(e) => onChange({ title: e.target.value })}
								placeholder="Shown to users"
							/>
						</label>
					</div>
					<div className="mt-2 flex items-center justify-between">
						<label className="flex items-center gap-2 text-sm text-slate-700">
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
							<label className="grid gap-1 text-xs text-slate-600">
								<span className="font-semibold">Options (one per line)</span>
								<textarea
									className="min-h-[88px] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
									value={enumToText(field.enumValues)}
									onChange={(e) => onChange({ enumValues: textToEnum(e.target.value) })}
								/>
							</label>
						</div>
					) : null}

					{field.kind === 'radio' || field.kind === 'multiselect' ? (
						<div className="mt-2">
							<label className="grid gap-1 text-xs text-slate-600">
								<span className="font-semibold">Options (one per line)</span>
								<textarea
									className="min-h-[88px] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
									value={enumToText(field.enumValues)}
									onChange={(e) => onChange({ enumValues: textToEnum(e.target.value) })}
								/>
								{field.kind === 'multiselect' ? (
									<div className="mt-1 text-[11px] text-slate-500">Multi-select returns an array of strings.</div>
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
