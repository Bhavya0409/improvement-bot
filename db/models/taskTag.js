import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
	class TaskTag extends Model {}

	TaskTag.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		task_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		tag_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		sequelize,
		modelName: 'TaskTag',
		tableName: 'task_tags',
		timestamps: true,
	});

	return TaskTag;
};

