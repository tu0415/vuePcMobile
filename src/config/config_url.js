let config = {}
let env = process.env.NODE_ENV;

if(env == 'development'){
	config = Object.assign({}, {
		token_url: "?grant_type=password&username=netkiller@msn.com&password=123456",
		web_url: "https://alpha.5kwords.com"
	})
}else if(env == 'production'){
	config = Object.assign({}, {
		token_url: "?grant_type=password&username=oauth@5kwords.com&password=dysaas123",
		web_url: "https://www.32know.com"
	})
}

export default config
