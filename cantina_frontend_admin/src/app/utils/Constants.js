let url = "";

url = process.env.PUBLIC_APP_URL;

export const Constants = {
	url: url,
	baseUrl: url + "/api/admin",
	imageUrl: url + '/storage/'
};
