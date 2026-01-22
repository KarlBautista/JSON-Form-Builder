type Props = {
	uiSchemaText: string
	parseError: string | null
	isDirty: boolean
	onChangeText: (next: string) => void
	onResetToAuto: () => void
}

export default function UiSchemaPanel({ uiSchemaText, parseError, isDirty, onChangeText, onResetToAuto }: Props) {
	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-sm font-extrabold tracking-tight text-slate-900">UI Schema</h2>
				<button
					type="button"
					onClick={onResetToAuto}
					className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
					title="Reset the editor to the generated uiSchema"
				>
					Reset to auto
				</button>
			</div>

			<div className="mt-2 text-xs text-slate-600">
				Status: {isDirty ? 'custom' : 'auto-synced'}
			</div>

			{parseError ? (
				<div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
					<div className="font-semibold">Invalid JSON</div>
					<div className="mt-1 text-xs opacity-90">{parseError}</div>
					<div className="mt-2 text-xs opacity-90">Preview falls back to auto uiSchema until this is fixed.</div>
				</div>
			) : null}

			<textarea
				value={uiSchemaText}
				onChange={(e) => onChangeText(e.target.value)}
				spellCheck={false}
				className="mt-3 h-[360px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
				placeholder={`{\n  "ui:order": ["field1"],\n  "field1": { "ui:widget": "textarea" }\n}`}
			/>
		</div>
	)
}
