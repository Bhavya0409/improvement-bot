export const calculateAge = (createdAt) => {
	const now = new Date();
	const created = new Date(createdAt);
	const diffInMilliseconds = now - created;
	const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
	const diffInDays = Math.floor(diffInHours / 24);
	
	if (diffInHours < 24) {
		return '<1 day ago';
	}
	
	// Use singular or plural
	return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
};
export const capitalizeFirstLetter = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};