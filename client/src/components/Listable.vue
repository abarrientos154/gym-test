<template>
  <div class="q-pa-md">
    <q-table
      :title="title"
      :data="data"
      :columns="columns"
      row-key="name"
      :no-data-label="`Aún no existen ${title} debes escoger un tema o un tipo`"
      :filter="filter"
    >
      <template v-slot:top-right>
        <!-- <q-search color="primary" v-model="filter" /> -->
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <q-td
          slot="body-cell-actions"
          slot-scope="props"
          :props="props"
          v-if="checkIfActions()"
        >
          <q-btn
            v-for="action in props.row.actions"
            :key="action.icon"
            :to="action.url"
            :icon="action.icon"
            @click="execute(props.row._id, action.title)"
            :color="action.color"
            size="sm"
            outline
            style="margin-right:4px"
          >
            <q-tooltip>
              {{action.title}}
            </q-tooltip>
          </q-btn>
      </q-td>
    </q-table>
  </div>
</template>
<script>
export default {
  name: 'Listable',
  props: ['columns', 'data', 'title'],
  data () {
    return {
      filter: ''
    }
  },
  methods: {
    checkIfActions () {
      return this.columns.find((element) => element.name === 'actions')
    },
    execute (id, title) {
      const emit = {
        id,
        title
      }
      this.$emit('function', emit)
    }
  }
}
</script>
