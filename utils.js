export const calculateAge = (createdAt) => {
	const now = new Date();
	const created = new Date(createdAt);
	const diffInMilliseconds = now - created;
	const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	
	// Less than 1 minute
	if (diffInMinutes < 1) {
		return 'Just now';
	}
	
	// Less than 1 hour
	if (diffInHours < 1) {
		return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
	}
	
	// Less than 1 day
	if (diffInDays < 1) {
		return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
	}
	
	// 1 day or more
	return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
};
export const capitalizeFirstLetter = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};