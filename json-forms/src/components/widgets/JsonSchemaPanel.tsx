import type { RJSFSchema } from '@rjsf/utils'

type Props = {
	schema: RJSFSchema
	errors?: string[]
}

export default function JsonSchemaPanel({ schema, errors }: Props) {
	return (
		<div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.85)] backdrop-blur-xl">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-sm font-extrabold tracking-tight text-slate-50">JSON Schema</h2>
			</div>

			{errors?.length ? (
				<div className="mt-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100">
					<div className="font-semibold">Fix before submit</div>
					<ul className="mt-1 list-disc pl-5">
						{errors.map((e) => (
							<li key={e}>{e}</li>
						))}
					</ul>
				</div>
			) : null}

			<pre className="mt-3 max-h-[70vh] overflow-auto rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-xs text-slate-100">
				{JSON.stringify(schema, null, 2)}
			</pre>
		</div>
	)
}
