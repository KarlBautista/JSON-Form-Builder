import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import type { BuilderField } from '../hooks/useSchemaBuilder'

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

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={
				'transform-gpu will-change-transform rounded-2xl border border-white/10 bg-slate-950/30 p-3 shadow-sm ' +
				(isDragging ? 'opacity-70 ring-1 ring-cyan-300/20' : '')
			}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<div className="flex items-center gap-2">
						<button
							type="button"
							className="cursor-grab rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
							{...listeners}
							{...attributes}
							title="Drag to reorder"
						>
							≡
						</button>
						<div className="text-sm font-semibold text-slate-50 truncate">{field.title || field.name}</div>
						<span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-200">
							{field.kind}
						</span>
					</div>
					<div className="mt-2 grid grid-cols-2 gap-2">
						<label className="grid gap-1 text-xs text-slate-300">
							<span className="font-semibold">Name</span>
							<input
								className="rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
								value={field.name}
								onChange={(e) => onChange({ name: e.target.value })}
								placeholder="e.g. firstName"
							/>
						</label>
						<label className="grid gap-1 text-xs text-slate-300">
							<span className="font-semibold">Title</span>
							<input
								className="rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
								value={field.title}
								onChange={(e) => onChange({ title: e.target.value })}
								placeholder="Shown to users"
							/>
						</label>
					</div>
					<div className="mt-2 flex items-center justify-between">
						<label className="flex items-center gap-2 text-sm text-slate-200">
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
							<label className="grid gap-1 text-xs text-slate-300">
								<span className="font-semibold">Options (one per line)</span>
								<textarea
									className="min-h-[88px] rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
									value={enumToText(field.enumValues)}
									onChange={(e) => onChange({ enumValues: textToEnum(e.target.value) })}
								/>
							</label>
						</div>
					) : null}
				</div>

				<button
					type="button"
					onClick={onRemove}
					className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/15"
				>
					Remove
				</button>
			</div>
		</div>
	)
}
