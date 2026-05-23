import {isDeferredTask} from "./taskUtils.js";

export const calculateAge = (task) => {
	const diffInMilliseconds = new Date() - task.sortDate;
	const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	
	if (diffInMinutes < 1) return 'Now';
	if (diffInHours < 1) return `${diffInMinutes}m`;
	if (diffInDays < 1) return `${diffInHours}h`;
	return `${diffInDays}d`;
};
export const getColorCircle = (task) => {
	const diffInMilliseconds = new Date() - task.sortDate;
	const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInHours / 24);
	
	if (isDeferredTask(task)) {
		return '⚪'
	}
	
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
export const getAgeWithColor = (task) => {
	const colorCircle = getColorCircle(task);
	const age = calculateAge(task);
	return `${colorCircle} ${age}`;
};
export const getDeferredTaskAgeWithColor = (task) => {
	const diffInMilliseconds = new Date(task.startDate) - new Date();
	const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	
	if (diffInMinutes < 1) return 'Now';
	if (diffInHours < 1) return `⚪ -${diffInMinutes}m`;
	if (diffInDays < 1) return `⚪ -${diffInHours}h`;
	return `⚪ -${diffInDays}d`;
}