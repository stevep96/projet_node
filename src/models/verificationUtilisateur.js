module.exports = (sequelize, DataTypes) => {
    return sequelize.define('verificationUtilisateur', {
      id_verification: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {msg: 'Erreur de token'},
          notNull: {msg: 'Erreur le token ne doit pas être vide'}
        }
      },
      id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {msg: ''},
          notNull: {msg: ''}
        }
      },
      date_expiration: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {msg: ``},
          notNull: {msg: ``}
        }
      }
    }, {
      timestamps: true,
      createdAt: 'date_creation',
      updatedAt: false
    })
  }