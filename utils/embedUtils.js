export const calculateAge = (createdAt, lastCompletedAt) => {
	// Prioritize lastCompletedAt if it exists
	const referenceDate = lastCompletedAt && new Date(lastCompletedAt) > new Date(createdAt)
		? new Date(lastCompletedAt)
		: new Date(createdAt);
	
	const now = new Date();
	const diffInMilliseconds = now - referenceDate;
	const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	
	// Less than 1 minute
	if (diffInMinutes < 1) {
		return 'Now';
	}
	
	// Less than 1 hour
	if (diffInHours < 1) {
		return `${diffInMinutes}m`;
	}
	
	// Less than 1 day
	if (diffInDays < 1) {
		return `${diffInHours}h`;
	}
	
	// 1 day or more
	return `${diffInDays}d`;
};
export const getColorCircle = (createdAt, lastCompletedAt) => {
	// Prioritize lastCompletedAt if it exists
	const referenceDate = lastCompletedAt && new Date(lastCompletedAt) > new Date(createdAt)
		? new Date(lastCompletedAt)
		: new Date(createdAt);
	
	const now = new Date();
	const diffInMilliseconds = now - referenceDate;
	const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInHours / 24);
	
	// 🟢 < 1 day
	if (diffInDays < 1) {
		return '🟢';
	}
	
	// 🟡 1-2 days (upper limit is inclusive)
	if (diffInDays <= 2) {
		return '🟡';
	}
	
	// 🟠 3-6 days (upper limit is inclusive)
	if (diffInDays <= 6) {
		return '🟠';
	}
	
	// 🔴 7+ days
	return '🔴';
};
export const getAgeWithColor = (createdAt, lastCompletedAt) => {
	const colorCircle = getColorCircle(createdAt, lastCompletedAt);
	const age = calculateAge(createdAt, lastCompletedAt);
	return `${colorCircle} ${age}`;
};