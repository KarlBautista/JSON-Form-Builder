import { useDraggable } from '@dnd-kit/core'
import type { FieldTemplate } from '../../schemas/fieldPalette'

type Props = {
	template: FieldTemplate
}

export default function PaletteCard({ template }: Props) {
	const id = `palette:${template.kind}`
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id,
		data: { from: 'palette', template },
	})

	const style: React.CSSProperties | undefined = transform
		? {
			transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		}
		: undefined

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={
				'transform-gpu will-change-transform rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2 shadow-sm select-none transition-colors ' +
				(isDragging
					? 'opacity-70'
					: 'hover:border-cyan-300/30 hover:bg-white/5 hover:shadow-[0_22px_60px_-45px_rgba(34,211,238,0.55)]')
			}
			{...listeners}
			{...attributes}
		>
			<div className="text-sm font-semibold text-slate-50">{template.label}</div>
			<div className="text-xs text-slate-300">Drag into canvas</div>
		</div>
	)
}
