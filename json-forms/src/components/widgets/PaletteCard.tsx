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
				'transform-gpu will-change-transform rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm select-none transition-colors ' +
				(isDragging
					? 'opacity-70'
					: 'hover:border-sky-300 hover:bg-sky-50')
			}
			{...listeners}
			{...attributes}
		>
			<div className="text-sm font-semibold text-slate-900">{template.label}</div>
			<div className="text-xs text-slate-500">Drag into canvas</div>
		</div>
	)
}
