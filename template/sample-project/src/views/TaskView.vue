<script setup lang="ts">
// Pick composition or options API
// import { ref } from 'vue'
// Do not move taskList variable
// const taskList = ref([])

// export default {
//   data() {
//     return {
//       taskList: [] // Do not move taskList variable-->
//     }
//   }
// }
</script>

<template>
  <main class="grid grid-cols-1 gap-6">
    <h1 class="text-2xl font-bold leading-9 text-gray-900">Task page</h1>
    <form class="flex items-end gap-4 shadow sm:rounded-lg p-6 bg-white">
      <div class="grow">
        <label for="task" class="block text-sm font-medium leading-6 text-gray-900">
          Task name
        </label>
        <div class="relative mt-2 rounded-md shadow-sm">
          <input
            id="task"
            type="text"
            name="task"
            class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Task name"
          />
        </div>
      </div>
      <button
        class="justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        (C)reate
      </button>
    </form>

    <section class="shadow sm:rounded-lg px-6 bg-white">
      <dl class="divide-y divide-gray-100">
        <div class="py-6 flex justify-between items-center gap-4" v-for="i in 3" :key="i">
          <dt class="text-base font-semibold leading-6 text-gray-900">
            Please use Slot for title field
          </dt>
          <button
            class="justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-red-500 hover:text-white"
          >
            Delete
          </button>
        </div>
      </dl>
    </section>
  </main>
</template>
