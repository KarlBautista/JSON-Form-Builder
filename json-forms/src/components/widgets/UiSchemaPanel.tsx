type Props = {
	uiSchemaText: string
	parseError: string | null
	isDirty: boolean
	onChangeText: (next: string) => void
	onResetToAuto: () => void
}

export default function UiSchemaPanel({ uiSchemaText, parseError, isDirty, onChangeText, onResetToAuto }: Props) {
	return (
		<div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.85)] backdrop-blur-xl">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-sm font-extrabold tracking-tight text-slate-50">UI Schema</h2>
				<button
					type="button"
					onClick={onResetToAuto}
					className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
					title="Reset the editor to the generated uiSchema"
				>
					Reset to auto
				</button>
			</div>

			<div className="mt-2 text-xs text-slate-300">
				Status: {isDirty ? 'custom' : 'auto-synced'}
			</div>

			{parseError ? (
				<div className="mt-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
					<div className="font-semibold">Invalid JSON</div>
					<div className="mt-1 text-xs opacity-90">{parseError}</div>
					<div className="mt-2 text-xs opacity-90">Preview falls back to auto uiSchema until this is fixed.</div>
				</div>
			) : null}

			<textarea
				value={uiSchemaText}
				onChange={(e) => onChangeText(e.target.value)}
				spellCheck={false}
				className="mt-3 h-[360px] w-full resize-none rounded-2xl border border-white/10 bg-slate-950/50 p-3 font-mono text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
				placeholder={`{\n  "ui:order": ["field1"],\n  "field1": { "ui:widget": "textarea" }\n}`}
			/>
		</div>
	)
}
