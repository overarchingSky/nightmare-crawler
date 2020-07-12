<template>
    <md-list>
        <list-item @click="() => {}" v-for="task in list" :key="task.id" :task="task"></list-item>
    </md-list>
</template>

<script>
import ListItem from './item'
export default {
    name:'regular-release-list',
    props:{
        list:{
            type:Array,
            default(){
                return []
            }
        }
    },
    components:{
        ListItem
    }
}
</script>

<style>

</style>
