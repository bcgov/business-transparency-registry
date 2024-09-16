<template>
  <div class="mt-5 bg-white rounded flex">
    <label v-if="showLabel" class="font-bold w-[200px]">{{ $t('texts.certify.certification') }}</label>
    <div :class="showLabel ? 'ml-20' : ''">
      <div>
        <UCheckbox
          v-model="certified"
          name="certification"
          variant="bcGov"
          data-cy="certify-section-checkbox"
          @change="$emit('update:modelValue', certified)"
        >
          <template #label>
            <div class="text-sm">
              <div>
                <span>{{ $t('texts.certify.part1') }}</span>
                <span class="font-bold">{{ name.toUpperCase() }}</span>
                <span>{{ part2Text ? part2Text : $t('texts.certify.part2') }}</span>
              </div>
              <br>
              <div>
                {{ $t('texts.certify.date') }}
                {{ date }}
              </div>
              <br>
              <div>
                {{ $t('texts.certify.note') }}
              </div>
            </div>
          </template>
        </UCheckbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<(e: 'update:modelValue', value: boolean) => void>()
defineProps({
  name: { type: String, required: true, default: 'name' },
  modelValue: { type: Boolean, required: true, default: false },
  part2Text: { type: String, required: false, default: '' },
  showLabel: { type: Boolean, required: false, default: true }
})

let date = ''
onBeforeMount(() => {
  date = dateToString(new Date(), 'YYYY-MM-DD')
})

const certified = ref(false)
</script>
