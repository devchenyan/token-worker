import jwt from 'jsonwebtoken';

const SECRET_KEY = 'web3platform';

export default {
	async fetch(request, env, ctx) {
		const token = request.headers.get('Authorization')?.split(' ')[1];

		if (!token) {
			return new Response(token, { status: 401 });
		}

		try {
			const decoded = jwt.verify(token, SECRET_KEY);

			let requestCount = parseInt(await env['token_namespace'].get('requestCount')) || 0;
			requestCount++;

			await env['token_namespace'].put('requestCount', requestCount.toString());

			await env['token_namespace'].put(requestCount.toString(), token);

			return new Response(JSON.stringify(decoded), {
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (error) {
			return new Response(`Invalid Access Token: ${error.message}`, { status: 403 });
		}
	},
};
