let url = "";

if (process.env.NODE_ENV === 'development') {
	url = "http://localhost:8000";
} else {
	url = "https://api.acantina.com.br";
}

export const Constants = {
	url: url,
	baseUrl: url + "/api/admin",
	imageUrl: url + '/storage/'
};
