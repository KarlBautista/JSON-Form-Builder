import type { RJSFSchema } from '@rjsf/utils'

type Props = {
	schema: RJSFSchema
	errors?: string[]
}

export default function JsonSchemaPanel({ schema, errors }: Props) {
	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-sm font-extrabold tracking-tight text-slate-900">JSON Schema</h2>
			</div>

			{errors?.length ? (
				<div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
					<div className="font-semibold">Fix before submit</div>
					<ul className="mt-1 list-disc pl-5">
						{errors.map((e) => (
							<li key={e}>{e}</li>
						))}
					</ul>
				</div>
			) : null}

			<pre className="mt-3 max-h-[70vh] overflow-auto rounded-2xl border border-slate-200 bg-slate-950 p-3 text-xs text-slate-50">
				{JSON.stringify(schema, null, 2)}
			</pre>
		</div>
	)
}
