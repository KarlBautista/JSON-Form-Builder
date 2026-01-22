import { useDraggable } from '@dnd-kit/core'
import type { FieldTemplate } from '../../schemas/fieldPalette'

type Props = {
	template: FieldTemplate
	onClick: () => void
}

export default function PaletteCard({ template, onClick }: Props) {
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

	const Icon = template.icon

	return (
		<div
			ref={setNodeRef}
			style={style}
			onClick={onClick}
			className={
				'group transform-gpu will-change-transform rounded-2xl border border-slate-200 bg-white p-2 shadow-sm select-none transition-colors cursor-pointer ' +
				(isDragging
					? 'opacity-70'
					: 'hover:border-sky-300 hover:bg-sky-50 active:scale-95 active:border-sky-400')
			}
			{...listeners}
			{...attributes}
		>
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-white group-hover:text-sky-500">
					<Icon size={20} />
				</div>
				<div>
					<div className="text-sm font-semibold text-slate-900">{template.label}</div>
					<div className="text-xs text-slate-500 hidden sm:block">Drag to add</div>
					<div className="text-xs text-slate-500 sm:hidden">Tap to add</div>
				</div>
			</div>
		</div>
	)
}
