type Props = {
	uiSchemaText: string
	parseError: string | null
	isDirty: boolean
	onChangeText: (next: string) => void
	onResetToAuto: () => void
}

export default function UiSchemaPanel({ uiSchemaText, parseError, isDirty, onChangeText, onResetToAuto }: Props) {
	return (
		<div className="rounded-[1.5rem] bg-white p-5 shadow-lg shadow-slate-200/50 ring-1 ring-slate-100">
			<div className="flex items-center justify-between gap-3 mb-3">
				<h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">UI Schema</h2>
				<button
					type="button"
					onClick={onResetToAuto}
					className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
					title="Reset the editor to the generated uiSchema"
				>
					Reset to auto
				</button>
			</div>

			<div className="mb-2 text-[10px] font-medium text-slate-400 uppercase tracking-wide">
				Status: {isDirty ? <span className="text-amber-500">Custom</span> : <span className="text-[#42855B]">Auto-synced</span>}
			</div>

			{parseError ? (
				<div className="mt-3 rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-xs text-rose-700">
					<div className="font-semibold mb-1">Invalid JSON</div>
					<div className="opacity-90">{parseError}</div>
				</div>
			) : null}

			<textarea
				value={uiSchemaText}
				onChange={(e) => onChangeText(e.target.value)}
				spellCheck={false}
				className="mt-2 h-[300px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#42855B]/20 focus:border-[#42855B]/50 transition-all"
				placeholder={`{\n  "ui:order": ["field1"],\n  "field1": { "ui:widget": "textarea" }\n}`}
			/>
		</div>
	)
}

