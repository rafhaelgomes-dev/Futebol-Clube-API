import { Model, DataTypes } from 'sequelize';
import db from '.';

class Team extends Model {
  declare id:number;
  declare teamName:string;
}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  tableName: 'teams',
  timestamps: false,
});

export default Team;
