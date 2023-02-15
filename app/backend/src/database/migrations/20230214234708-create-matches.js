'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      homeTeamId: {
        field: 'home_team_id',
        allowNull: false,
        type: Sequelize.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'teams',
          key: 'id',
        },
      },
        homeTeamGoals: {
          field: 'home_team_goals',
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        awayTeamId: {
          field: 'away_team_id',
          allowNull: false,
          type: Sequelize.INTEGER,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          references: {
            model: 'teams',
            key: 'id',
          }
        },
        awayTeamGoals: {
          field: 'away_team_goals',
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        inProgress: {
          field: 'in_progress',
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('matches')
  }
};
