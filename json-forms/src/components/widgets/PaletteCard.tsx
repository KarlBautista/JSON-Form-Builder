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
				'group transform-gpu will-change-transform rounded-xl border border-slate-100 bg-white p-3 shadow-sm select-none cursor-pointer transition-all duration-200 ease-out ' +
				(isDragging
					? 'opacity-70 scale-105 shadow-xl ring-2 ring-[#42855B]/20'
					: 'hover:border-[#42855B]/30 hover:bg-[#42855B]/5 hover:shadow-lg hover:shadow-[#42855B]/5 hover:-translate-y-0.5 active:scale-95 active:border-[#42855B]/40')
			}
			{...listeners}
			{...attributes}
		>
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#42855B] text-white shadow-sm ring-1 ring-[#42855B]/20 transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
					<Icon size={20} />
				</div>
				<div>
					<div className="text-sm font-semibold text-slate-700 group-hover:text-[#42855B] transition-colors">{template.label}</div>
					<div className="text-xs text-slate-400 hidden sm:block">Drag to add</div>
					<div className="text-xs text-slate-400 sm:hidden">Tap to add</div>
				</div>
			</div>
		</div>
	)
}
