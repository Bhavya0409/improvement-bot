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
		startDate: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
		},
		sortDate: {
			type: DataTypes.VIRTUAL,
			get: function() {
				if (this.getDataValue('lastCompletedAt')) return this.getDataValue('lastCompletedAt');
				if (this.getDataValue('startDate'))       return this.getDataValue('startDate');
				return this.getDataValue('createdAt');
			}
		}
	}, {
		sequelize,
		modelName: 'Task',
		tableName: 'tasks',
		timestamps: true,
	});
	
	return Task;
};

