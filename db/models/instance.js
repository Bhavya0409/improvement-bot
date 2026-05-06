import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
	class Instance extends Model {}
	
	Instance.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		task_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		completedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	}, {
		sequelize,
		modelName: 'Instance',
		tableName: 'instances',
		timestamps: true,
	});
	
	return Instance;
};

