/*
Navicat MySQL Data Transfer

Source Server         : aly
Source Server Version : 80026
Source Host           : 120.25.232.80:3306
Source Database       : onlyBlog

Target Server Type    : MYSQL
Target Server Version : 80026
File Encoding         : 65001

Date: 2023-09-05 11:52:19
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
INSERT INTO `admin` VALUES ('3', '123', '$2a$10$BqTeBoI5OXVgtSBfL0Iq9OzHprB02IC/NfrdY3Aie6QRYIYrY4q2u', null, null, '1', '2');
INSERT INTO `admin` VALUES ('4', 'admin', '$2a$10$KDDW.HWgxY2cgz2gb0pz5Ou44YXD1PizT1AgtnOQqolh4MxhNsU9q', 'https://localhost:3000/upload/f8a6e9ab7180d0ead9d2aa100.jpg', null, '1', '0');
INSERT INTO `admin` VALUES ('5', '11', '$2a$10$7qJnRMFWaaTqbvp3icqzYOc7APMqGzfaSnL6IZTVI0VYip9KBroUy', 'http://localhost:3000/upload/2e350376a84c48cea76af3c07.png', null, '1', '1');
INSERT INTO `admin` VALUES ('8', '888', '$2a$10$VEguHHWaNBwzqSMbkYyJJeMlsKlHeJ0B6okDqHcFlvy8uIHLFZPbW', null, null, '1', '4');
INSERT INTO `admin` VALUES ('9', '456', '$2a$10$ea3Sb.SoR5ctvtGG0kk1K.OnCtf00I.DctG6HnHHyDfwmfZylKNRS', null, '127.0.0.1', '1', '4');

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
INSERT INTO `admin_role` VALUES ('8', '9', '4');

-- ----------------------------
-- Table structure for `article`
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL,
  `user_id` int NOT NULL DEFAULT '0',
  `admin_id` int NOT NULL DEFAULT '0',
  `type` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(60) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES ('1', 'hello', '<ol><li>good morning</li></ol><p style=\"line-height: 1.15;\"><strong>132123132321</strong></p><p style=\"line-height: 1.15;\"><br></p><p style=\"line-height: 1.15; text-align: center;\"><strong>而我国v本文56vbe</strong></p>', '0', '1', '0', null, null, '2023-08-02 01:05:07', '2023-09-05 10:08:40');
INSERT INTO `article` VALUES ('2', '', '<p>我爱你</p>', '0', '0', '5', null, null, '2023-08-02 01:06:27', '2023-09-05 10:08:46');
INSERT INTO `article` VALUES ('3', 'test1', '<p style=\"text-align: center;\"><strong>love&nbsp;</strong>123132213132&nbsp;</p><p><img src=\"blob:http://127.0.0.1:5173/22afff4a-e2ad-4b5a-abf9-e7e41da7e6f6\" style=\"width: 300px;\" class=\"fr-fic fr-dib\"></p><p style=\"text-align: center;\">next life only love you</p><p style=\"text-align: center;\"><img src=\"http://localhost:3000/upload/acecbed8f5397cb8fe01a4200.png\" style=\"width: 400px;\" class=\"fr-fic fr-dib\"></p>', '1', '8', '0', null, null, '2023-08-02 01:07:42', '2023-08-15 01:31:19');
INSERT INTO `article` VALUES ('4', '123', '16561515151515151515151515<p><br></p><p><u>trhdrtthrh</u></p><p><br></p>', '1', '0', '4', null, null, '2023-08-15 15:52:28', '2023-08-15 15:52:28');
INSERT INTO `article` VALUES ('5', '时间流逝', '<p>真快啊 不知不觉又一年了 虽然我们不再见面不再联系 但希望彼此能过好各自的生活</p>', '1', '3', '0', null, null, '2023-08-15 15:56:38', '2023-08-15 15:56:38');
INSERT INTO `article` VALUES ('7', '1111', '<p><span class=\"fr-emoticon fr-deletable fr-emoticon-img\" style=\"background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f600.svg);\">&nbsp;</span></p><p><br></p><p><img src=\"https://localhost:3000/upload/820349b3080adbd18a46cfe00.jpg\" style=\"width: 400px;\" class=\"fr-fic fr-dib\"></p>', '1', '0', '2', null, null, '2023-08-15 17:18:54', '2023-08-29 14:59:04');
INSERT INTO `article` VALUES ('8', '而废物i哦就恢复', '<p>e如何如何把紫色然后把</p>', '1', '0', '8', '管理员', '888', '2023-08-29 15:25:23', '2023-08-29 15:25:23');
INSERT INTO `article` VALUES ('9', '213312312', '<p><img src=\"https://localhost:3658/upload/e1adcaadecdaf26efb3c1e600.jpg\" style=\"width: 400px;\" class=\"fr-fic fr-dib\"></p><p><br></p>', '1', '0', '2', '管理员', 'lx', '2023-09-05 11:29:52', '2023-09-05 11:29:52');
INSERT INTO `article` VALUES ('10', '213312312', '<p><img src=\"https://localhost:3658/upload/e1adcaadecdaf26efb3c1e600.jpg\" style=\"width: 400px;\" class=\"fr-fic fr-dib\"></p><p><br></p>', '1', '0', '4', '管理员', 'admin', '2023-09-05 11:30:56', '2023-09-05 11:30:56');

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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb3 AVG_ROW_LENGTH=481 ROW_FORMAT=DYNAMIC COMMENT='权限表';

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
) ENGINE=InnoDB AUTO_INCREMENT=178 DEFAULT CHARSET=utf8mb3 AVG_ROW_LENGTH=442 ROW_FORMAT=DYNAMIC COMMENT='角色权限联结表';

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
INSERT INTO `role_permission` VALUES ('128', '2', '16');
INSERT INTO `role_permission` VALUES ('129', '2', '13');
INSERT INTO `role_permission` VALUES ('130', '2', '1');
INSERT INTO `role_permission` VALUES ('131', '2', '2');
INSERT INTO `role_permission` VALUES ('132', '2', '3');
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
INSERT INTO `role_permission` VALUES ('155', '1', '15');
INSERT INTO `role_permission` VALUES ('156', '1', '9');
INSERT INTO `role_permission` VALUES ('157', '1', '10');
INSERT INTO `role_permission` VALUES ('158', '1', '11');
INSERT INTO `role_permission` VALUES ('159', '1', '12');
INSERT INTO `role_permission` VALUES ('160', '1', '16');
INSERT INTO `role_permission` VALUES ('161', '1', '13');
INSERT INTO `role_permission` VALUES ('162', '1', '1');
INSERT INTO `role_permission` VALUES ('163', '1', '2');
INSERT INTO `role_permission` VALUES ('164', '1', '3');
INSERT INTO `role_permission` VALUES ('165', '1', '14');
INSERT INTO `role_permission` VALUES ('166', '1', '4');
INSERT INTO `role_permission` VALUES ('167', '1', '5');
INSERT INTO `role_permission` VALUES ('168', '1', '6');
INSERT INTO `role_permission` VALUES ('169', '1', '7');
INSERT INTO `role_permission` VALUES ('170', '1', '8');
INSERT INTO `role_permission` VALUES ('171', '1', '17');
INSERT INTO `role_permission` VALUES ('172', '1', '18');
INSERT INTO `role_permission` VALUES ('173', '1', '19');
INSERT INTO `role_permission` VALUES ('174', '1', '20');
INSERT INTO `role_permission` VALUES ('175', '1', '21');
INSERT INTO `role_permission` VALUES ('176', '1', '22');
INSERT INTO `role_permission` VALUES ('177', '1', '23');

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
INSERT INTO `user` VALUES ('2', 'lx', '$2a$10$mTRJP.YQ85/UW/xCDCTELeUh.1G0JpXMTs2mjfTfQ0dEI1lgodt.K', 'https://localhost:3658/upload/f78cf9a6f5bb79b846fb8f600.jpg', '1', 'uiopu', null, null, '2023-08-01 00:00:00', '2023-08-01 00:00:00');
INSERT INTO `user` VALUES ('3', '123', '$2a$10$BqTeBoI5OXVgtSBfL0Iq9OzHprB02IC/NfrdY3Aie6QRYIYrY4q2u', null, '1', '2', null, null, '2023-08-01 00:00:00', '2023-08-07 00:00:00');
INSERT INTO `user` VALUES ('4', 'admin', '$2a$10$KDDW.HWgxY2cgz2gb0pz5Ou44YXD1PizT1AgtnOQqolh4MxhNsU9q', 'https://localhost:3658/upload/f8a6e9ab7180d0ead9d2aa100.jpg', '1', '0', '127.0.0.1', null, '2023-08-01 00:00:00', '2023-08-01 00:00:00');
INSERT INTO `user` VALUES ('12', '555', '$2a$10$N5NGgk70CR.vX3T3ZmYBWuIi/SofNuA8sJYXY4m1hf6Lsbx5TKlQu', null, '1', '123', '127.0.0.1', '123', '2023-09-05 11:16:05', '2023-09-05 11:16:05');
