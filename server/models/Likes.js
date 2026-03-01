module.exports = (sequelize) => {
    const Likes = sequelize.define("Likes");
    Likes.associate = (models) => {
        Likes.belongsTo(models.Posts, {
            onDelete: "cascade",
        });
    };
    return Likes;
};
