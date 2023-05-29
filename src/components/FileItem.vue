<template>
    <li>
        <span class="clickable" @click="handleClick" @dblclick="handleDoubleClick" @contextmenu="handleRightClick">
            <i :class="getFileIconClass"></i>
            {{ file.label }}
        </span>
        <ul v-if="isDirectory && file.open">
            <FileItem v-for="subfile in file.children" :key="subfile.key" :file="subfile"
                @file-click="(event) => reEmitWithUpdatedPath('file-click', event)"
                @file-double-click="(event) => reEmitWithUpdatedPath('file-double-click', event)"
                @file-right-click="(event) => reEmitWithUpdatedPath('file-right-click', event)" 
                @createDirectory="(event) => reEmitWithUpdatedPath('createDirectory', event)"
                @createFile="(event) => reEmitWithUpdatedPath('createFile', event)"
                />
            <FileAndDirectoryCreationItems 
                @createDirectory="createDirectory"
                @createFile="createFile" />

        </ul>
    </li>    

</template>
  
<script>
import Menu from 'primevue/menu';
import FileAndDirectoryCreationItems from '@/components/utils/FileAndDirectoryCreationItems.vue'

export default {
    props: {
        file: {
            type: Object,
            required: true
        }
    },
    components : {FileAndDirectoryCreationItems},
    computed: {
        getFileIconClass() {
            if (this.isDirectory) {
                if (this.file.open) {
                    return 'pi pi-folder-open'
                }
                else {
                    return 'pi pi-folder'; // Replace with appropriate icon class for directories
                }
            } else {
                // Determine file type and return corresponding icon class
                const fileType = this.file.label.split('.').pop();
                switch (fileType) {
                    case 'jpg':
                    case 'png':
                    case 'gif':
                        return 'pi pi-image'; // Replace with appropriate icon class for images
                    case 'txt':
                        return 'pi pi-file-alt'; // Replace with appropriate icon class for text files
                    default:
                        return 'pi pi-file'; // Replace with default icon class for other file types
                }
            }
        },
        isDirectory() {
            if (this.file.children) {
                return true;
            }
            return false;
        }
    },
    methods: {
        handleClick() {
            this.$emit('file-click', {file : this.file, folder : this.isDirectory ? this.file.label + "/" : ""});
        },
        handleDoubleClick() {
            this.$emit('file-double-click', {file : this.file.file, folder : this.isDirectory ? this.file.label + "/" : ""});
        },
        createFile(event) {
            this.$emit('createFile', {file : this.file, folder : this.isDirectory ? this.file.label + "/" : "", addedFile : event});
        },
        createDirectory(event) {
            this.$emit('createDirectory', {file : this.file, folder : this.isDirectory ? this.file.label + "/" : "", folderName : event});
        },
        handleRightClick(event) {
            if (this.isDirectory) {
                event.preventDefault();
                this.$emit('file-right-click', {file : this.file, folder : this.file.label});
            }
        },
        reEmitWithUpdatedPath(eventID, data)
        {
            data.folder = this.file.label + "/" + data.folder;
            this.$emit(eventID, data );
        }
    }
};
</script>
  
<style scoped>
ul {
    list-style-type: none;
}
.clickable {
    cursor: pointer;
}
</style>