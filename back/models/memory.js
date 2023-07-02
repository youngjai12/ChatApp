const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Memory extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        imageUrl: {
          type: DataTypes.TEXT, // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: true, // 필수
        },
        summary: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: false,
        },
      },
      {
        modelName: "Channel",
        tableName: "channels",
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Memory.belongsTo(db.User, { as: "Sender"});
    db.Memory.belongsTo(db.Workspace);
  }
};
