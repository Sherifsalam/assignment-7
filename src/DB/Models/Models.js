import { DataTypes, Sequelize } from "sequelize";

export const sequelize = new Sequelize("assignment_7", "root", "", {
  host: "localhost",
  dialect: "mysql",
});



export const User = sequelize.define(
  "User",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkPasswordLength(value) {
          if (value.length <= 6)
            throw new Error("Password must be greater than 6 characters.");
        },
      },
    },
    role: { type: DataTypes.ENUM("admin", "user"), allowNull: false },
  },
  {
  tableName: "users",
  freezeTableName: true,    
  timestamps: true,
  hooks: {  beforeCreate(user) {
        if (user.name.length <= 2)
          throw new Error("Name must be greater than 2 characters.");
      },
    }, 
});


export class Post extends Sequelize.Model {}

Post.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    context: { type: DataTypes.TEXT, allowNull: false },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
  },
 {
  sequelize,
  modelName: "Post",
  tableName: "posts",       
  freezeTableName: true,    
  timestamps: true,
  paranoid: true,
});



export class Comment extends Sequelize.Model {}

Comment.init(
  {
    context: { type: DataTypes.TEXT, allowNull: false },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Post, key: "id" },
    },
  },
 {
  sequelize,
  modelName: "Comment",
  tableName: "comments",    
  freezeTableName: true,    
  timestamps: true,
});


User.hasMany(Post, { foreignKey: "user_id", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "user_id" });

Post.hasMany(Comment, { foreignKey: "post_id", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "post_id" });

