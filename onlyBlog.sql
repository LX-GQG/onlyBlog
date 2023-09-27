/*
Navicat MySQL Data Transfer

Source Server         : aly
Source Server Version : 80026
Source Host           : 120.25.232.80:3306
Source Database       : onlyBlog

Target Server Type    : MYSQL
Target Server Version : 80026
File Encoding         : 65001

Date: 2023-09-22 09:23:43
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `admin`
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '鐢ㄦ埛鍚?',
  `password` varchar(60) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `ip` varchar(60) DEFAULT NULL,
  `status` tinyint unsigned NOT NULL DEFAULT '1' COMMENT '状态',
  `rid` int unsigned NOT NULL COMMENT '鍏宠仈role',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('2', 'lx', '$2a$10$vgywj35E5Ny7Yp7w9RZzDeNirOV2KaL/Pca4jrUwbUbVa7SOL0uuy', 'https://localhost:3658/upload/ec93911cefbca221381835f01.jpg', '::1', '1', '1');
INSERT INTO `admin` VALUES ('3', '123', '$2a$10$BqTeBoI5OXVgtSBfL0Iq9OzHprB02IC/NfrdY3Aie6QRYIYrY4q2u', null, '::1', '1', '2');
INSERT INTO `admin` VALUES ('4', 'admin', '$2a$10$KDDW.HWgxY2cgz2gb0pz5Ou44YXD1PizT1AgtnOQqolh4MxhNsU9q', 'https://localhost:3000/upload/f8a6e9ab7180d0ead9d2aa100.jpg', '113.87.128.170', '1', '0');
INSERT INTO `admin` VALUES ('5', '11', '$2a$10$7qJnRMFWaaTqbvp3icqzYOc7APMqGzfaSnL6IZTVI0VYip9KBroUy', 'http://localhost:3000/upload/2e350376a84c48cea76af3c07.png', null, '1', '1');
INSERT INTO `admin` VALUES ('8', '888', '$2a$10$VEguHHWaNBwzqSMbkYyJJeMlsKlHeJ0B6okDqHcFlvy8uIHLFZPbW', null, '::1', '1', '4');
INSERT INTO `admin` VALUES ('9', '456', '$2a$10$ea3Sb.SoR5ctvtGG0kk1K.OnCtf00I.DctG6HnHHyDfwmfZylKNRS', null, '127.0.0.1', '1', '8');

-- ----------------------------
-- Table structure for `admin_role`
-- ----------------------------
DROP TABLE IF EXISTS `admin_role`;
CREATE TABLE `admin_role` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `rid` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of admin_role
-- ----------------------------
INSERT INTO `admin_role` VALUES ('1', '1', '1');
INSERT INTO `admin_role` VALUES ('2', '2', '1');
INSERT INTO `admin_role` VALUES ('3', '3', '2');
INSERT INTO `admin_role` VALUES ('4', '4', '0');
INSERT INTO `admin_role` VALUES ('5', '5', '1');
INSERT INTO `admin_role` VALUES ('6', '7', '0');
INSERT INTO `admin_role` VALUES ('7', '8', '4');
INSERT INTO `admin_role` VALUES ('8', '9', '8');

-- ----------------------------
-- Table structure for `article`
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cover` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL,
  `user_id` int NOT NULL DEFAULT '0',
  `admin_id` int NOT NULL DEFAULT '0',
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES ('1', null, 'hello', '<ol><li>good morning</li></ol><p style=\"line-height: 1.15;\"><strong>132123132321</strong></p><p style=\"line-height: 1.15;\"><br></p><p style=\"line-height: 1.15; text-align: center;\"><strong>而我国v本文56vbe</strong></p>', '1', '1', '0', '2023-08-02 01:05:07', '2023-09-14 10:31:31');
INSERT INTO `article` VALUES ('4', null, '123', '16561515151515151515151515<p><br></p><p><u>trhdrtthrh</u></p><p><br></p>', '1', '0', '4', '2023-08-15 15:52:28', '2023-09-14 10:31:30');
INSERT INTO `article` VALUES ('5', null, '时间流逝', '<p>真快啊 不知不觉又一年了 虽然我们不再见面不再联系 但希望彼此能过好各自的生活</p>', '1', '3', '0', '2023-08-15 15:56:38', '2023-08-15 15:56:38');
INSERT INTO `article` VALUES ('9', null, '213312312', '<p><img src=\"https://localhost:3658/upload/e1adcaadecdaf26efb3c1e600.jpg\" style=\"width: 400px;\" class=\"fr-fic fr-dib\"></p><p><br></p>', '1', '0', '2', '2023-09-05 11:29:52', '2023-09-14 10:31:29');
INSERT INTO `article` VALUES ('10', null, '213312312', '<p style=\"text-align: center;\"><img src=\"https://localhost:3658/upload/e1adcaadecdaf26efb3c1e600.jpg\" style=\"width: 400px;\" class=\"fr-fic fr-dib\"></p><p><br></p>', '1', '0', '4', '2023-09-05 11:30:56', '2023-09-14 10:31:28');
INSERT INTO `article` VALUES ('12', 'https://www.gqgwr.cn:3658/upload/09b2a7a0f05e7081cfcc62201.jpg', '这里长眠着我最爱的人', '<p id=\"isPasted\"><span style=\"color:#333333;\"><span style=\"font-size:12px;\"><span style=\"background-color:#ffffff;\">1.喜欢是福祉，给享福之人。</span></span></span></p><p><span style=\"color:#333333;\"><span style=\"font-size:12px;\"><span style=\"background-color:#ffffff;\">&nbsp; &nbsp;爱是磨难，给吃得苦的人。</span></span></span></p><p><span style=\"color:#333333;\"><span style=\"font-size:12px;\"><span style=\"background-color:#ffffff;\">&nbsp; &nbsp;我愿题主，吃得此苦，填世间海。</span></span></span></p><p><span style=\"color:#333333;\"><span style=\"font-size:12px;\"><span style=\"background-color:#ffffff;\">2.有一种爱情叫做Crush，相信你我都曾经历过，也可能正在或者将会经历</span></span></span></p><p><span style=\"color:#333333;\"><span style=\"font-size:12px;\"><span style=\"background-color:#ffffff;\">3.喜欢是忽视缺点，爱是包容缺点。对于这句话，我的感触是，纵使TA有很多毛病，但是有一点确信无疑&ldquo;这一点儿都不会挡着你继续爱TA&rdquo;</span></span></span></p>', '1', '0', '2', '2023-09-07 14:10:15', '2023-09-07 16:24:58');
INSERT INTO `article` VALUES ('13', 'https://www.gqgwr.cn:3658/upload/09b2a7a0f05e7081cfcc62200.jpg', '没有你的海岸，颜色也暗淡了', '<p id=\"isPasted\">其实没什么的</p><p><br></p><p>时间会消磨内心中的啥啥啥伤痛，前提真得很重要，就是你要舍得放下。做自己应该做的，让自己变好的一切事情。</p><p><br></p><p>我分手后的几天，每天早上起床脑中出现的第一句话就是；&ldquo;F，cnm，谁说我们没有未来的。&rdquo;（因为分手时ta说，我们俩是没有未来的）</p><p><br></p><p>然后就是努力不去打扰ta&hellip;&hellip;</p><p><br></p><p>QQ不是有一个什么坦白说，我就只敢在上面和ta发一发消息，被认出来了&hellip;&hellip;然后就是不敢打扰</p><p><br></p><p>七月份的时候，厚着脸皮又发消息。刚开始回了几次，后面就不回了。然鹅我并没有死心，我做饭很难吃，但是很想亲手给ta做一顿饭吃，我直接把这个想法发给ta，当天晚上QQ空间就把我屏蔽了。突然明白，不喜欢了就是不喜欢了。</p><p><br></p><p><br></p><p><br></p>', '1', '0', '2', '2023-09-07 14:11:56', '2023-09-07 16:24:47');
INSERT INTO `article` VALUES ('14', 'https://www.gqgwr.cn:3658/upload/09b2a7a0f05e7081cfcc62202.jpg', '小姐姐：我只对雪那么认真！', '<p id=\"isPasted\">一、姑娘你应该明白的是，气质比年龄重要，微笑比颜值重要，开心比爱情重要。</p><p>二、我把自己养这么好，不想便宜了任何人，面包我有了，凭什么找一个给不起我爱情，还想来分我面包的人。</p><p>三、你是善良的姑娘，你活在这世上，应该有人教会你该怎样被爱和去爱，而不是一次跌倒，就魂不守舍地躺在原地，等着先前的混蛋来救自己。</p><p>四、女孩子还是要好好努力工作，不然别人给你520元，你就以为自己遇到了爱情。</p><p>五、我喜欢这个功利的世界，因为它承认每个人的努力，好看的姑娘能轻松几年，但会赚钱的姑娘才能过好一生！</p><p>六、希望下一个喜欢的人，不会再让我这么难堪，不会再让我一个人走完所有路，会一直爱我，告诉我，我是他最宝贝的女孩子。</p><p>七、一个女人最酷的样子，应该是风情万种，吻不同的唇，喜欢不同的人，却不爱任何人。</p><p>八、女孩子为什么要努力？因为你长大了，不能总做父母的小棉袄，你要成为他们的防弹衣，还要做自己的铠甲。</p><p>九、一哄就好的人，活该受尽委屈；一爱就认真的人，活该被伤害。愿你是能披荆斩棘的女英雄，也是被人疼爱的小朋友。</p>', '1', '0', '2', '2023-09-07 14:13:21', '2023-09-07 16:26:04');
INSERT INTO `article` VALUES ('15', 'https://www.gqgwr.cn:3658/upload/085ce65f1d2709b3dc37a8000.jpg', '承认突破！将是我至今力量的全部！', '<p id=\"isPasted\">读书并不能使人睿智，只能使人博学。</p><p>分明没有去跟人类在某一领域的顶尖的头脑交锋，也没有真正吸收，而把这一行为称为读书，说实话，败坏了读书一词的德性。</p><p><br></p><p>现代社会，生产书，读书的成本大大降低，我觉得有必要区分一下，认过一本书的字，和，读过一本书。</p>', '1', '0', '2', '2023-09-08 09:31:32', '2023-09-08 09:31:32');
INSERT INTO `article` VALUES ('16', 'https://www.gqgwr.cn:3658/upload/085ce65f1d2709b3dc37a8001.jpg', '海鸥失去大海，而我失去了你', '<p id=\"isPasted\"><a href=\"https://www.google.com/search?q=%E4%BD%A0%E7%9F%A5%E9%81%93%E7%9C%9F%E6%AD%A3%E5%96%9C%E6%AC%A2%E4%B8%8A%E4%B8%80%E4%B8%AA%E4%BA%BA%E6%98%AF%E4%BB%80%E4%B9%88%E6%84%9F%E8%A7%89%E5%90%97%EF%BC%9F&oq=%E4%BD%A0%E7%9F%A5%E9%81%93%E7%9C%9F%E6%AD%A3%E5%96%9C%E6%AC%A2%E4%B8%8A%E4%B8%80%E4%B8%AA%E4%BA%BA%E6%98%AF%E4%BB%80%E4%B9%88%E6%84%9F%E8%A7%89%E5%90%97%EF%BC%9F&aqs=chrome..69i57j0i546l4.355j0j4&sourceid=chrome&ie=UTF-8\">你知道真正喜欢上一个人是什么感觉吗？</a></p><p>关注她、迷恋她、欣喜她，期待与她灵魂和身体的融合，感受对方的温柔、亲密、唯美。</p><p>心理学家总结出了真正喜欢上一个人，会出现的四种感觉。</p><p>生理上的冲动</p><p>独自占有</p><p>先有安全，后有感觉</p><p>强烈的自我展露</p>', '1', '0', '2', '2023-09-08 09:32:35', '2023-09-15 10:00:00');
INSERT INTO `article` VALUES ('18', null, '123', '123', '1', '3', '0', '2023-09-18 17:57:30', '2023-09-18 17:57:30');
INSERT INTO `article` VALUES ('21', 'https://localhost:3658/upload/d33062d2cd0ec81f697cee000.jpg', '132132312132132132', '<p>1231212321313123</p>', '1', '2', '0', '2023-09-20 10:46:19', '2023-09-21 13:40:16');
INSERT INTO `article` VALUES ('28', 'https://www.gqgwr.cn:3658/upload/9d674a9fc2f7c68cab6137001.jpg', '132132312132132132', '<p>1561651651165</p>', '1', '2', '0', '2023-09-20 11:20:48', '2023-09-20 11:20:48');
INSERT INTO `article` VALUES ('29', 'https://www.gqgwr.cn:3658/upload/9d674a9fc2f7c68cab6137007.png', '我爱你', '<p>forever</p>', '1', '2', '0', '2023-09-20 15:13:49', '2023-09-20 15:13:49');

-- ----------------------------
-- Table structure for `menu`
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `checked` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES ('1', '用户管理', '1');
INSERT INTO `menu` VALUES ('2', '角色管理', '1');
INSERT INTO `menu` VALUES ('3', '文章管理', '1');

-- ----------------------------
-- Table structure for `permission`
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rid` int NOT NULL,
  `pid` int NOT NULL COMMENT '鏉冮檺鍚嶇О',
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '閺夊啴妾虹猾璇茬€?',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '鍒嗙粍绫诲瀷',
  `ismenu` int NOT NULL,
  `checked` tinyint(1) NOT NULL,
  `icon` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb3 AVG_ROW_LENGTH=481 ROW_FORMAT=DYNAMIC COMMENT='权限表';

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `permission` VALUES ('1', '1', '13', '/admin/adminList', '后台用户列表', '0', '0', null);
INSERT INTO `permission` VALUES ('2', '1', '13', '/admin/updateAdmin', '修改后台用户', '0', '0', null);
INSERT INTO `permission` VALUES ('3', '1', '13', '/admin/deleteAdmin', '删除后台用户', '0', '0', null);
INSERT INTO `permission` VALUES ('4', '2', '14', '/admin/roleList', '角色列表', '0', '0', null);
INSERT INTO `permission` VALUES ('5', '2', '14', '/admin/addRole', '添加角色', '0', '0', null);
INSERT INTO `permission` VALUES ('6', '2', '14', '/admin/updateRole', '修改角色', '0', '0', null);
INSERT INTO `permission` VALUES ('7', '2', '14', '/admin/deleteRole', '删除角色', '0', '0', null);
INSERT INTO `permission` VALUES ('8', '3', '14', '/admin/permissionList', '权限列表', '0', '0', null);
INSERT INTO `permission` VALUES ('9', '4', '15', '/admin/addArticle', '添加文章', '0', '0', null);
INSERT INTO `permission` VALUES ('10', '4', '15', '/admin/articleList', '文章列表', '0', '0', null);
INSERT INTO `permission` VALUES ('11', '4', '15', '/admin/updateArticle', '修改文章', '0', '0', null);
INSERT INTO `permission` VALUES ('12', '4', '15', '/admin/deleteArticle', '删除文章', '0', '0', null);
INSERT INTO `permission` VALUES ('13', '0', '16', '/permissions/user', '用户管理', '1', '0', null);
INSERT INTO `permission` VALUES ('14', '0', '16', '/permissions/role', '角色管理', '1', '0', null);
INSERT INTO `permission` VALUES ('15', '0', '0', '/article/article', '文章管理', '1', '0', 'Tickets');
INSERT INTO `permission` VALUES ('16', '0', '0', null, '权限管理', '1', '0', 'Operation');
INSERT INTO `permission` VALUES ('17', '3', '14', '/admin/assignPermission', '分配权限', '0', '0', null);
INSERT INTO `permission` VALUES ('18', '3', '14', '/admin/getRolePermission', '获取角色权限', '0', '0', null);
INSERT INTO `permission` VALUES ('19', '0', '0', '/user/user', '用户管理', '1', '0', 'User');
INSERT INTO `permission` VALUES ('20', '5', '19', '/admin/userList', '用户列表', '0', '0', null);
INSERT INTO `permission` VALUES ('21', '5', '19', '/admin/updateUser', '修改用户', '0', '0', null);
INSERT INTO `permission` VALUES ('22', '5', '19', '/admin/addUser', '添加用户', '0', '0', null);
INSERT INTO `permission` VALUES ('23', '5', '19', '/admin/deleteUser', '删除用户', '0', '0', null);
INSERT INTO `permission` VALUES ('24', '4', '15', '/admin/getArticleTag', '获取关联标签', '0', '0', null);
INSERT INTO `permission` VALUES ('25', '0', '0', '/tag/tag', '标签管理', '1', '0', 'Discount');
INSERT INTO `permission` VALUES ('26', '6', '25', '/admin/tagList', '标签列表', '0', '0', null);
INSERT INTO `permission` VALUES ('27', '6', '25', '/admin/updateTag', '修改标签', '0', '0', null);
INSERT INTO `permission` VALUES ('28', '6', '25', '/admin/deleteTag', '删除标签', '0', '0', null);
INSERT INTO `permission` VALUES ('29', '6', '25', '/admin/addTag', '添加标签', '0', '0', null);
INSERT INTO `permission` VALUES ('30', '1', '13', '/admin/addAdmin', '添加后台用户', '0', '0', null);
INSERT INTO `permission` VALUES ('31', '1', '13', '/admin/getRoleList', '获取关联角色', '0', '0', null);

-- ----------------------------
-- Table structure for `role`
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '涓婚敭ID',
  `role_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '瑙掕壊绫诲瀷',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', '管理员', '');
INSERT INTO `role` VALUES ('2', '管理用户', '');
INSERT INTO `role` VALUES ('3', '管理角色', '');
INSERT INTO `role` VALUES ('4', '管理文章', '');
INSERT INTO `role` VALUES ('6', '管理权限', '分配权限');
INSERT INTO `role` VALUES ('8', '测试', '123');

-- ----------------------------
-- Table structure for `role_menu`
-- ----------------------------
DROP TABLE IF EXISTS `role_menu`;
CREATE TABLE `role_menu` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pid` int NOT NULL,
  `mid` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of role_menu
-- ----------------------------
INSERT INTO `role_menu` VALUES ('1', '1', '1');
INSERT INTO `role_menu` VALUES ('2', '2', '2');
INSERT INTO `role_menu` VALUES ('3', '3', '3');
INSERT INTO `role_menu` VALUES ('4', '4', '4');
INSERT INTO `role_menu` VALUES ('5', '2', '1');
INSERT INTO `role_menu` VALUES ('6', '3', '1');
INSERT INTO `role_menu` VALUES ('7', '4', '1');

-- ----------------------------
-- Table structure for `role_permission`
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rid` int DEFAULT NULL COMMENT '角色id',
  `pid` int DEFAULT NULL COMMENT '权限id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=244 DEFAULT CHARSET=utf8mb3 AVG_ROW_LENGTH=442 ROW_FORMAT=DYNAMIC COMMENT='角色权限联结表';

-- ----------------------------
-- Records of role_permission
-- ----------------------------
INSERT INTO `role_permission` VALUES ('119', '3', '16');
INSERT INTO `role_permission` VALUES ('120', '3', '14');
INSERT INTO `role_permission` VALUES ('121', '3', '4');
INSERT INTO `role_permission` VALUES ('122', '3', '5');
INSERT INTO `role_permission` VALUES ('123', '3', '6');
INSERT INTO `role_permission` VALUES ('124', '3', '7');
INSERT INTO `role_permission` VALUES ('125', '3', '8');
INSERT INTO `role_permission` VALUES ('126', '3', '17');
INSERT INTO `role_permission` VALUES ('127', '3', '18');
INSERT INTO `role_permission` VALUES ('133', '6', '16');
INSERT INTO `role_permission` VALUES ('134', '6', '13');
INSERT INTO `role_permission` VALUES ('135', '6', '1');
INSERT INTO `role_permission` VALUES ('136', '6', '2');
INSERT INTO `role_permission` VALUES ('137', '6', '3');
INSERT INTO `role_permission` VALUES ('138', '6', '14');
INSERT INTO `role_permission` VALUES ('139', '6', '4');
INSERT INTO `role_permission` VALUES ('140', '6', '5');
INSERT INTO `role_permission` VALUES ('141', '6', '6');
INSERT INTO `role_permission` VALUES ('142', '6', '7');
INSERT INTO `role_permission` VALUES ('143', '6', '8');
INSERT INTO `role_permission` VALUES ('144', '6', '17');
INSERT INTO `role_permission` VALUES ('145', '6', '18');
INSERT INTO `role_permission` VALUES ('150', '4', '15');
INSERT INTO `role_permission` VALUES ('151', '4', '9');
INSERT INTO `role_permission` VALUES ('152', '4', '10');
INSERT INTO `role_permission` VALUES ('153', '4', '11');
INSERT INTO `role_permission` VALUES ('154', '4', '12');
INSERT INTO `role_permission` VALUES ('207', '1', '15');
INSERT INTO `role_permission` VALUES ('208', '1', '9');
INSERT INTO `role_permission` VALUES ('209', '1', '10');
INSERT INTO `role_permission` VALUES ('210', '1', '11');
INSERT INTO `role_permission` VALUES ('211', '1', '12');
INSERT INTO `role_permission` VALUES ('212', '1', '24');
INSERT INTO `role_permission` VALUES ('213', '1', '16');
INSERT INTO `role_permission` VALUES ('214', '1', '13');
INSERT INTO `role_permission` VALUES ('215', '1', '1');
INSERT INTO `role_permission` VALUES ('216', '1', '2');
INSERT INTO `role_permission` VALUES ('217', '1', '3');
INSERT INTO `role_permission` VALUES ('218', '1', '30');
INSERT INTO `role_permission` VALUES ('219', '1', '31');
INSERT INTO `role_permission` VALUES ('220', '1', '14');
INSERT INTO `role_permission` VALUES ('221', '1', '4');
INSERT INTO `role_permission` VALUES ('222', '1', '5');
INSERT INTO `role_permission` VALUES ('223', '1', '6');
INSERT INTO `role_permission` VALUES ('224', '1', '7');
INSERT INTO `role_permission` VALUES ('225', '1', '8');
INSERT INTO `role_permission` VALUES ('226', '1', '17');
INSERT INTO `role_permission` VALUES ('227', '1', '18');
INSERT INTO `role_permission` VALUES ('228', '1', '19');
INSERT INTO `role_permission` VALUES ('229', '1', '20');
INSERT INTO `role_permission` VALUES ('230', '1', '21');
INSERT INTO `role_permission` VALUES ('231', '1', '22');
INSERT INTO `role_permission` VALUES ('232', '1', '23');
INSERT INTO `role_permission` VALUES ('233', '1', '25');
INSERT INTO `role_permission` VALUES ('234', '1', '26');
INSERT INTO `role_permission` VALUES ('235', '1', '27');
INSERT INTO `role_permission` VALUES ('236', '1', '28');
INSERT INTO `role_permission` VALUES ('237', '1', '29');
INSERT INTO `role_permission` VALUES ('238', '2', '16');
INSERT INTO `role_permission` VALUES ('239', '2', '13');
INSERT INTO `role_permission` VALUES ('240', '2', '1');
INSERT INTO `role_permission` VALUES ('241', '2', '2');
INSERT INTO `role_permission` VALUES ('242', '2', '3');
INSERT INTO `role_permission` VALUES ('243', '2', '30');

-- ----------------------------
-- Table structure for `tag`
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of tag
-- ----------------------------
INSERT INTO `tag` VALUES ('1', '爱情');
INSERT INTO `tag` VALUES ('2', '编程');
INSERT INTO `tag` VALUES ('3', '测试');
INSERT INTO `tag` VALUES ('4', '回忆过往');
INSERT INTO `tag` VALUES ('5', '遗憾');
INSERT INTO `tag` VALUES ('6', '爱恨');

-- ----------------------------
-- Table structure for `tag_article`
-- ----------------------------
DROP TABLE IF EXISTS `tag_article`;
CREATE TABLE `tag_article` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tid` int NOT NULL,
  `aid` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of tag_article
-- ----------------------------
INSERT INTO `tag_article` VALUES ('1', '1', '5');
INSERT INTO `tag_article` VALUES ('2', '2', '5');
INSERT INTO `tag_article` VALUES ('3', '2', '8');
INSERT INTO `tag_article` VALUES ('12', '1', '14');
INSERT INTO `tag_article` VALUES ('13', '5', '15');
INSERT INTO `tag_article` VALUES ('19', '1', '9');
INSERT INTO `tag_article` VALUES ('20', '3', '9');
INSERT INTO `tag_article` VALUES ('21', '2', '9');
INSERT INTO `tag_article` VALUES ('22', '3', '1');
INSERT INTO `tag_article` VALUES ('23', '4', '16');
INSERT INTO `tag_article` VALUES ('24', '1', '16');
INSERT INTO `tag_article` VALUES ('25', '1', '27');
INSERT INTO `tag_article` VALUES ('26', '2', '27');
INSERT INTO `tag_article` VALUES ('27', '2', '28');
INSERT INTO `tag_article` VALUES ('28', '3', '28');
INSERT INTO `tag_article` VALUES ('29', '4', '28');
INSERT INTO `tag_article` VALUES ('30', '5', '28');
INSERT INTO `tag_article` VALUES ('31', '1', '29');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '鐢ㄦ埛鍚?',
  `password` varchar(60) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `status` tinyint unsigned NOT NULL DEFAULT '1' COMMENT '状态',
  `email` varchar(255) DEFAULT NULL COMMENT '閸忓疇浠坮ole',
  `ip` varchar(20) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT '2000-01-01 00:00:00',
  `update_time` datetime NOT NULL DEFAULT '2000-01-01 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'test', '$2a$10$4Ah6TzpBOJT77cLAVEeIJ.ajrihkDPQt5DaZIfYsKz/Fq48mjOnvC', null, '1', '1137601326@qq.com', null, '测试人员', '2023-08-01 00:00:00', '2023-08-01 00:00:00');
INSERT INTO `user` VALUES ('2', 'lx', '$2a$10$mTRJP.YQ85/UW/xCDCTELeUh.1G0JpXMTs2mjfTfQ0dEI1lgodt.K', 'https://www.gqgwr.cn:3658/upload/f78cf9a6f5bb79b846fb8f600.jpg', '1', 'uiopu', '119.123.73.204', null, '2023-08-01 00:00:00', '2023-08-01 00:00:00');
INSERT INTO `user` VALUES ('3', '123', '$2a$10$BqTeBoI5OXVgtSBfL0Iq9OzHprB02IC/NfrdY3Aie6QRYIYrY4q2u', null, '1', '2', '119.123.73.204', null, '2023-08-01 00:00:00', '2023-08-07 00:00:00');
INSERT INTO `user` VALUES ('4', 'admin', '$2a$10$KDDW.HWgxY2cgz2gb0pz5Ou44YXD1PizT1AgtnOQqolh4MxhNsU9q', 'https://www.gqgwr.cn:3658/upload/f8a6e9ab7180d0ead9d2aa100.jpg', '1', '0', '113.87.128.170', null, '2023-08-01 00:00:00', '2023-08-01 00:00:00');
INSERT INTO `user` VALUES ('12', '555', '$2a$10$N5NGgk70CR.vX3T3ZmYBWuIi/SofNuA8sJYXY4m1hf6Lsbx5TKlQu', null, '1', '123', '127.0.0.1', '123', '2023-09-05 11:16:05', '2023-09-05 11:16:05');
