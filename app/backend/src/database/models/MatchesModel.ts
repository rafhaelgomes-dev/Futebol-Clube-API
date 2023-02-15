import { Model, DataTypes } from 'sequelize';
import db from '.';
import Teams from './TeamModel';

class Matches extends Model {
  declare id:number;
  declare homeTeamId:number;
  declare homeTeamGoals:number;
  declare awayTeamId:number;
  declare awayTeamGoals:number;
  declare inProgress:number;
}

Matches.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  homeTeamId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  tableName: 'matches',
  timestamps: false,
});

Teams.hasMany(Matches, { foreignKey: 'awayTeamId', as: 'awayTeam' });
Teams.hasMany(Matches, { foreignKey: 'homeTeamId', as: 'homeTeam' });

Matches.belongsTo(Teams, { foreignKey: 'awayTeamId', as: 'Matches' });
Matches.belongsTo(Teams, { foreignKey: 'homeTeamId', as: 'Teams' });

export default Matches;
