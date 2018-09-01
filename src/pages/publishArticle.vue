<template>
	<div class="publishArticle">
		<el-alert style="margin-bottom: 5px;" title="温馨提示: 为了避免发布文章图片显示不完整，请勿直接复制粘贴其它网站图片，可先保存到本地再上传，谢谢 !" type="warning" show-icon></el-alert>
		<div class="publishArticleBox">
			<div class="title">发表文章</div>
			<el-form style="margin-top: 20px;" :label-position="labelPosition" label-width="55px">
				<el-form-item label="标题: ">
					<el-input v-model="form.title" :maxlength="maxlen"></el-input>
				</el-form-item>
				<el-form-item label="简介: ">
					<el-input v-model="form.summary" :maxlength="maxSummarylen"></el-input>
				</el-form-item>
				<div class="editContainer">
					<quill-editor v-model="form.content"
					              ref="myQuillEditor"
					              class="editer"
					              :options="editorOption">
					</quill-editor>
					<div class="imageBox" v-if="showHadImage" v-loading="loadingImage" element-loading-text="请稍等，图片上传中">
						<div class="imageTitle">上传图片<i class="el-icon-error fr rightIcon" @click="uploadFileEvt"></i></div>
						<div class="tips">
							温馨提示: 最多可以上传9张图片哟, 点击上传的图片即可加入到内容文本。
						</div>
						<div class="imageContent clear">
							<template v-for="(item, index) in hadImageList">
								<div class="uploadList">
									<img @click="insertImageEvt(item)" :src="item.url" class="image"/>
									<i class="el-icon-close deleteIcon" @click="deleteImageEvt(index)"></i>
								</div>
							</template>
							<div class="uploadList defaultList">
								<el-upload id="quillUploadId"
								           action="/forum/upload/file"
								           :show-file-list="false"
								           multiple
								           :limit="9"
								           :data="uploadData"
								           :before-upload='beforeQuillUpload'
								           :on-success='quillUploadSuccess'>
									<i class="el-icon-plus"></i>
								</el-upload>
							</div>
						</div>
					</div>
				</div>
				<el-form-item style="margin-top: 70px" label="标签: ">
					<div class="tagsTitleBox">
						<div class="selectedTagBox clear">
							<span class="addTag" @click="chooseTagEvt">添加标签<i class="el-icon-plus"></i></span>
							<template v-for="item in selectedTagList">
								<el-tag :key="item.id" type="success" closable @close="cancelTagEvt(item)">{{item.name}}</el-tag>
							</template>
						</div>
						<div class="parentTagBox" v-if="showTargetListVisible">
							<div class="tagBox clear" v-for="item in tagList">
								<div class="tagListTitle fl">{{ item.name }}:</div>
								<div class="tagListBox fl">
									<template v-for="itemList in item.list">
										<span class="tag" @click="selectedTagEvt(itemList)">{{ itemList.name }}</span>
									</template>
								</div>
							</div>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="类型: ">
					<el-select v-model="form.type">
						<el-option label="普通文章" value="0"></el-option>
						<el-option label="视频类文章" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="封面: ">
					<div class="uploadImage">
						<el-upload v-loading="loadingIcon" style="width: 122px"
						           class="avatar-uploader"
						           action="/forum/upload/file"
						           :show-file-list="false"
						           :data="uploadData"
						           :on-success="uploadImg"
						           :before-upload="beforeImgUpload">
							<img v-if="form.imgUrl" :src="form.imgUrl" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<div class="uploadTips">温馨提示: 封面建议尺寸为 750像素*420像素</div>
					</div>
				</el-form-item>
			</el-form>
			<div class="submitBox">
				<el-button type="default" @click="previewEvt">预览文章</el-button>
				<el-button type="default" @click="saveEvt">保存草稿</el-button>
				<el-button type="primary" @click="submitEvt">提交</el-button>
			</div>
		</div>
		<preview-dialog v-if="showPreviewVisible" :articleData.sync="articleData" :dataVisible.sync="showPreviewVisible"></preview-dialog>
	</div>
</template>

<script>
	import Vue from 'vue'
	import indexApi from '../api/indexApi'
	import vueQuillEditor from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import previewDialog from '../pages/common/previewDialog'
	import {mapState} from 'vuex'

	Vue.use(vueQuillEditor)
	export default {
		name: "publishArticle",
		data() {
			return {
				articleData: {},
				showHadImage: false,
				loadingImage: false,
				hadImageList: [],
				selectedTagList: [],
				tagList: [],
				childrenTagList: [],
				labelPosition: '',
				maxlen: 50,
				maxSummarylen: 115,
				uploadData: {
					uploadType: 1,
					userId: ''
				},
				form: {
					title: '',
					imgUrl: '',
					content: '',
					summary: '',
					type: '0'
				},
				addImgRange: '',
				editorOption: {
					modules: {
						toolbar: [
							['bold', 'italic', 'underline', 'strike'],
							[{'header': 1}, {'header': 2}],
							[{'indent': '-1'}, {'indent': '+1'}],
							[{'size': ['small', false, 'large', 'huge']}],
							[{'header': [1, 2, 3, 4, 5, 6, false]}],
							[{'color': []}, {'background': []}],
							['image', 'video']
						]
					},
					placeholder: ''
				},
				loadingIcon: false,
				showTargetListVisible: false,
				showPreviewVisible: false
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		components: {
			previewDialog
		},
		mounted() {
			this.uploadData.userId = this.userInfo.id;
			this.$refs.myQuillEditor.quill.getModule("toolbar").addHandler("image", this.uploadFileEvt);

			this.getTagsList();
		},
		methods: {
			getArticleList(data) {
				indexApi.detailList({
					id: data,
					userId: this.userInfo.id
				}).then(d => {
					if (d.code == "0") {
						if (d.data) {
							this.form = {
								title: d.data.title,
								imgUrl: d.data.imgUri,
								content: d.data.content,
								summary: d.data.summary,
								type: d.data.articleType
							};

							if (d.data.tags && d.data.tags.length) {
								this.selectedTagList.splice(0);
								this.selectedTagList = this.selectedTagList.concat(d.data.tags);
							}
						}
					} else {
						this.$showErrorMessage(d)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			getTagsList() {
				indexApi.tagList().then(d => {
					if (d.code == '0') {
						if (d.data && d.data.list && d.data.list.length) {
							this.tagList.splice(0);
							this.tagList = this.tagList.concat(d.data.list);

							if(this.$route.query.id){
								this.getArticleList(this.$route.query.id)
							}
						}
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err);
				})
			},
			chooseTagEvt(){
				this.showTargetListVisible = !this.showTargetListVisible;
			},
			selectedTagTitleEvt(data){
				this.childrenTagList.splice(0)
				this.childrenTagList = this.childrenTagList.concat(data.list);
			},
			cancelTagEvt(data){
				this.selectedTagList.forEach((item, index) => {
					if(item.id == data.id){
						this.selectedTagList.splice(index, 1);
					}
				})
			},
			selectedTagEvt(data) {
				let selectedItem = this.selectedTagList.map(item => {
					return item.id;
				})

				if(selectedItem.indexOf(data.id) == -1){
					this.selectedTagList.push(data)
				}
			},
			uploadImg(data) {
				this.loadingIcon = false
				if (data.code == '0') {
					if (data.data) {
						this.form.imgUrl = data.data.url
					}
				} else {
					this.$showErrorMessage(data.reason)
				}
			},
			uploadFileEvt() {
				// let fileInput = document.querySelector('#quillUploadId input');
				// fileInput.click()
				this.showHadImage = !this.showHadImage
			},
			beforeQuillUpload() {
				if(this.hadImageList.length == 9){
					this.$showErrorMessage('最多可以上传9张图片!')
					return false
				}
				this.loadingImage = true
			},
			insertImageEvt(data){
				this.addImgRange = this.$refs.myQuillEditor.quill.getSelection();
				this.$refs.myQuillEditor.quill.insertEmbed(this.addImgRange != null ?
					this.addImgRange.index : 0, 'image', data.url)
			},
			deleteImageEvt(index) {
				this.hadImageList.splice(index, 1)
			},
			quillUploadSuccess(data) {
				this.loadingImage = false
				if (data.code == '0') {
					if(this.hadImageList.length == 9){
						return false
					}
					this.hadImageList.push(data.data)
				} else {
					this.$showErrorMessage(data.reason)
				}
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

				this.loadingIcon = true

				return isFormat && isLt10M;
			},
			submitEvt() {
				if (this.form.title == '') {
					this.$showErrorMessage('文章标题不能为空!')
					return false;
				}
				if (this.selectedTagList.length == 0) {
					this.$showErrorMessage('文章标签不能为空!')
					return false;
				}

				let tags = this.selectedTagList.map(item => {
					return item.id
				})

				if (this.$route.query.id) {
					indexApi.editArticle({
						title: this.form.title,
						content: this.form.content,
						summary: this.form.summary,
						imgUrl: this.form.imgUrl,
						userId: this.userInfo.id,
						saveType: 0,
						type: this.form.type,
						articleId: this.$route.query.id,
						tagIds: tags.join(',')
					}).then(d => {
						if (d.code == '0') {
							this.$showSuccessMessage('提交成功!');
							this.$router.push({name: 'personal', query: {id: 2}});
						} else {
							this.$showErrorMessage(d.reason)
						}
					}).catch(err => {
						this.$showErrorMessage(err)
					})
				} else {
					indexApi.articleAdd({
						title: this.form.title,
						content: this.form.content,
						summary: this.form.summary,
						imgUrl: this.form.imgUrl,
						saveType: 0,
						type: this.form.type,
						userId: this.userInfo.id,
						tagIds: tags.join(',')
					}).then(d => {
						if (d.code == '0') {
							this.$showSuccessMessage('提交成功!');
							this.$router.push({name: 'personal', query: {id: 2}});
						} else {
							this.$showErrorMessage(d.reason)
						}
					}).catch(err => {
						this.$showErrorMessage(err)
					})
				}
			},
			saveEvt() {
				let tags = this.selectedTagList.map(item => {
					return item.id
				})

				if (this.$route.query.id) {
					indexApi.editArticle({
						title: this.form.title,
						content: this.form.content,
						summary: this.form.summary,
						imgUrl: this.form.imgUrl,
						userId: this.userInfo.id,
						saveType: 1,
						type: this.form.type,
						articleId: this.$route.query.id,
						tagIds: tags.join(',')
					}).then(d => {
						if (d.code == '0') {
							this.$showSuccessMessage('保存成功!');
							this.$router.push({name: 'personal', query: {id: 2}});
						} else {
							this.$showErrorMessage(d.reason)
						}
					}).catch(err => {
						this.$showErrorMessage(err)
					})
				} else {
					indexApi.articleAdd({
						title: this.form.title,
						content: this.form.content,
						summary: this.form.summary,
						imgUrl: this.form.imgUrl,
						userId: this.userInfo.id,
						saveType: 1,
						type: this.form.type,
						tagIds: tags.join(',')
					}).then(d => {
						if (d.code == '0') {
							this.$showSuccessMessage('保存成功!');
							this.$router.push({name: 'personal', query: {id: 2}});
						} else {
							this.$showErrorMessage(d.reason)
						}
					}).catch(err => {
						this.$showErrorMessage(err)
					})
				}
			},
			previewEvt(){
				this.articleData = Object.assign({}, this.form, {
					tags: this.selectedTagList
				})
				this.showPreviewVisible = true;
			}
		}
	}
</script>

<style>
	.editContainer .ql-editing{
		left: 575px !important;
		top: 0 !important;
	}
	.imageBox .el-upload{
		width: 68px;
		height: 68px;
		line-height: 68px;
	}
</style>
<style lang="less" scoped>
	.publishArticle {
		margin: 0 auto;
		width: 1120px;
		padding: 80px 0;
    padding-bottom: 140px;
		.publishArticleBox {
			background: #ffffff;
			padding: 10px 25px;
			.selectedTagBox{
				span{
					margin-top: 5px;
					margin-right: 15px;
					float: left;
				}
				.addTag{
					background: rgba(64,158,255,.1);
					display: inline-block;
					line-height: 30px;
					text-align: center;
					cursor: pointer;
					padding: 0 8px;
					color: #409eff;
					border: 1px solid rgba(64,158,255,.2);
					border-radius: 4px;
				}
			}
			.tagListTitle{
				margin-right: 10px;
				width: 5%;
			}
			.tagListBox{
				width: 94%;
			}
			.tagBox {
				.tag {
					width: 100px;
					text-align: center;
					border-radius: 5px;
					line-height: 30px;
					display: inline-block;
					cursor: pointer;
					background: #F5F3F3;
					font-size: 12px;
					margin-right: 15px;
				}
				.active {
					background: #3B84D1;
					color: #ffffff;
				}
			}
			.title {
				line-height: 40px;
				font-size: 16px;
				border-bottom: 1px solid #ccc;
			}
			.editContainer {
				margin-top: 20px;
				height: 600px;
				position: relative;
				.editer {
					height: 600px;
				}
				.imageBox{
					background: #ffffff;
					width: 440px;
					height: 260px;
					position: absolute;
					top: 50px;
					left: 420px;
					border: 1px solid #E7E7E7;
					.imageTitle{
						line-height: 50px;
						background: #F7F7F7;
						padding: 0 20px;
						font-size: 12px;
						color: #666666;
						.rightIcon{
							line-height: 50px;
							cursor: pointer;
						}
					}
					.tips{
						line-height: 25px;
						color: red;
						padding: 0 20px;
					}
					.imageContent{
						.uploadList{
							margin: 10px 0 10px 10px;
							width: 70px;
							height: 70px;
							float: left;
							position: relative;
							.image{
								width: 70px;
								height: 70px;
								border: none;
								outline: none;
							}
							.deleteIcon{
								position: absolute;
								width: 14px;
								height: 14px;
								border-radius: 7px;
								top: -4px;
								right: -4px;
								background: #F7F7F7;
								line-height: 14px;
								text-align: center;
								border: 1px dashed #D9D9D9;
								cursor: pointer;
							}
						}
						.defaultList{
							width: 68px;
							height: 68px;
							background: #FBFBFB;
							border-radius: 3px;
							border: 1px dashed #D9D9D9;
						}
					}
				}
			}
			.uploadImage {
				margin: 10px 0;
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
			}
			.uploadTips {
				margin-top: 10px;
				color: #ff0000;
				font-size: 14px;
				line-height: 20px;
			}
			.submitBox {
				margin-top: 40px;
				text-align: center;
			}
		}
	}
</style>
