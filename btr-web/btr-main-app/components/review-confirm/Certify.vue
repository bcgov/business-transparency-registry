<template>
  <h2 class="font-bold text-lg mt-5" data-cy="review-confirm-section-heading">
    2. Certify
  </h2>
  <div class="mt-5 p-10 bg-white rounded flex" data-cy="effective-date-select">
    <label class="font-bold text-lg w-[200px]">Certification</label>
    <div class="ml-10 text-lg">
      <div>
        <UCheckbox
          v-model="certified"
          name="certification"
          variant="bcGov"
          @change="$emit('update:modelValue', certified)"
        >
          <template #label>
            <div class="text-sm">
              <div>
                I, <span class="font-bold"> {{ name.toUpperCase() }}</span>, certify that I have relevant knowledge of this BC Benefit Company and that I am authorized to make this filing.
              </div><br>
              <div>
                Date: {{ date }}
              </div><br>
              <div>
                Note:It is an offence to make a false or misleading statement in respect of a material fact in a record submitted to the Corporate Registry for filing.
                See section 427 of the Business Corporations Act.
              </div>
            </div>
          </template>
        </UCheckbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{(e: 'update:modelValue', value: boolean): void }>()
defineProps({
  name: { type: String, required: true, default: 'name' },
  date: { type: String, required: true, default: 'date' },
  modelValue: { type: Boolean, required: true, default: false }
})

const certified = ref(false)
</script>
