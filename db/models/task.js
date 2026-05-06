import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
	class Task extends Model {}
	
	Task.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		completed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		completedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
		},
		lastCompletedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
		},
	}, {
		sequelize,
		modelName: 'Task',
		tableName: 'tasks',
		timestamps: true,
	});
	
	return Task;
};

