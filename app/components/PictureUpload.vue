<script setup lang="ts">
const picture = ref<any>([]);
const fileInput1 = ref(); //ref for image input field
const imageDataUrl = ref(); //image src for file input div

const createBase64Image = function (FileObject: any) {
  const reader = new FileReader();
  reader.onload = (event) => {
    imageDataUrl.value = event.target?.result;
  };
  reader.readAsDataURL(FileObject);
  sendImageUrl();
};
const emit = defineEmits(["update:modelValue", "imageDataUrl"]);

const sendImageUrl = () => {
  const formData = new FormData();

  picture.value[0] == undefined
    ? ""
    : formData.append("file", picture.value[0]);
  emit("imageDataUrl", picture.value[0]);
};

defineProps<{
  modelValue: string | undefined | null;
  side: string;
}>();

const chooseImage1 = () => {
  fileInput1.value.click();
};

watch(
  () => picture.value,
  (newVal) => {
    if (newVal != "") {
      createBase64Image(newVal[0]);
    } else {
      imageDataUrl.value = null;
    }
  },
  { deep: true }
);
</script>

<template>
  <v-responsive>
    <v-card>
      <v-card-text rounded="lg">
        <div
          class="border-opacity-25 cursor-pointer rounded-lg d-flex align-center justify-center"
          :style="{ 'background-image': `url(${imageDataUrl})` }"
          style="
            background-position: center center;
            background-size: contain;
            background-color: #f8f8f8;
            width: 100%;
            height: 200px;
          "
          @click="chooseImage1"
        >
          <div
            v-if="picture.length == 0"
            class="d-flex flex-column align-center ga-2"
          >
            <v-icon
              icon="mdi-file-upload-outline"
              color="#8A8A8A"
              size="35px"
            />
            <span class="text-body-1 text-center"
              >Click here to upload {{ side }} picture</span
            >
          </div>
          <v-file-input
            v-show="false"
            v-model="picture[0]"
            @update:model-value="(val) => $emit('update:modelValue', val)"
            ref="fileInput1"
            accept="image/*"
          />
        </div>
      </v-card-text>
    </v-card>
    <v-progress-linear
      model-value="100"
      color="success"
      :height="6"
      v-if="picture.length != 0"
      class="mt-3"
    />
  </v-responsive>
</template>
