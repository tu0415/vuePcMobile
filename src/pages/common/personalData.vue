<template>
	<div class="list">
		<div class="title">个人资料
			<el-button size="small" class="fr" type="primary" @click="saveInfoEvt">保存</el-button>
		</div>
		<div class="dataList">
			<el-form :label-position="labelPosition" :model="form" label-width="80px">
				<el-form-item label="手机号">
					<span class="mobile">{{ form.mobile }}</span>
				</el-form-item>
				<el-form-item label="昵称">
					<el-input v-model="form.nickname" class="nickNameInput" :maxlength="nickNameLen"></el-input>
				</el-form-item>
				<el-form-item label="个人简介">
					<el-input type="textarea" class="textareaContent" v-model="form.summary" :maxlength="summaryLen"></el-input>
				</el-form-item>
				<el-form-item label="上传头像">
					<el-upload v-loading="loadingIcon" style="width: 122px"
					           class="avatar-uploader"
					           action="/forum/upload/file"
					           :show-file-list="false"
					           :on-success="uploadImg"
					           :data="uploadData"
					           :before-upload="beforeImgUpload">
						<img v-if="form.picture" :src="form.picture" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import indexApi from '../../api/indexApi'
	import * as types from '../../store/types'
	import Utils from '../../utils/format'
	import {mapState} from 'vuex'

	export default {
		name: "personalData",
		data() {
			return {
				nickNameLen: 15,
				summaryLen: 20,
				uploadData: {
					uploadType: 0,
					userId: ''
				},
				form: {
					mobile: '',
					nickname: '',
					summary: '',
					picture: ''
				},
				labelPosition: 'right',
				userId: '',
				loadingIcon: false
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		mounted() {
			this.userId = this.userInfo.id;
			this.uploadData.userId = this.userInfo.id;

			this.getUserInfo();
		},
		methods: {
			getUserInfo() {
				indexApi.getMemberList({
					userId: this.userId
				}).then(d => {
					if (d.code == "0") {
						if (d.data) {
							this.form = {
								mobile: d.data.mobile || '',
								nickname: d.data.nickname || '',
								summary: d.data.summary || '',
								picture: d.data.picture || ''
							}
						}
					} else {
						this.$showSuccessMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			uploadImg(data) {
				this.loadingIcon = false
				if (data.code == '0') {
					if (data.data) {
						this.form.picture = data.data.url;
					}
				} else {
					this.$showErrorMessage(data.reason)
				}
			},
			saveInfoEvt() {
				if (!this.form.picture) {
					this.$showErrorMessage('请上线头像');
					return false
				}
				indexApi.updateMember({
					id: this.userId,
					picture: this.form.picture,
					nickname: this.form.nickname,
					summary: this.form.summary
				}).then(d => {
					if (d.code == "0") {
						this.$showSuccessMessage('更新成功!');
						let updateUserInfo = {
							"id": this.userInfo.id,
							"nickname": this.form.nickname,
							"picture": this.form.picture,
							"identification": this.userInfo.identification,
							"status": this.userInfo.status
						}
						this.$store.commit(types.USER_INFO, updateUserInfo);
						Utils.setCookie('cur_dt', Base64.encode(JSON.stringify(updateUserInfo)), 1);
						this.getUserInfo();
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			beforeImgUpload(file) {
				let isFormat = (/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(file.name));
				let isLt10M = file.size / 1024 / 1024 < 10;

				if (!isFormat) {
					this.$showErrorMessage('上传头像图片格式不正确!');
					return false
				}
				if (!isLt10M) {
					this.$showErrorMessage('上传头像图片大小不能超过 10MB!');
					return false
				}

				this.loadingIcon = true;

				return isFormat && isLt10M;
			}
		}
	}
</script>
<style>
	.dataList .el-form-item {
		margin-bottom: 10px;
	}

	.textareaContent textarea {
		width: 330px;
		height: 60px;
		resize: none;
		color: #606266;
	}
</style>
<style lang="less" scoped>
	.list {
		width: 100%;
		.title {
			width: 100%;
			font-size: 20px;
			color: #4A505A;
			padding-bottom: 20px;
			border-bottom: 1px solid #E7E7E7;
		}
		.dataList {
			margin-top: 20px;
			.avatar-uploader {
				.el-upload {
					border: 1px dashed #d9d9d9;
					margin-top: 10px;
					border-radius: 6px;
					cursor: pointer;
					position: relative;
					overflow: hidden;
				}
			}
			.avatar-uploader {
				.el-upload:hover {
					border-color: #20a0ff;
				}
			}
			.avatar-uploader-icon {
				font-size: 28px;
				color: #8c939d;
				width: 120px;
				height: 120px;
				line-height: 120px;
				text-align: center;
				border: 1px dashed #d9d9d9;
			}
			.avatar {
				width: 120px;
				height: 120px;
				display: block;
			}
			.nickNameInput{
				width: 330px;
			}
			.mobile{
				color: #606266;
			}
		}
	}
</style>
