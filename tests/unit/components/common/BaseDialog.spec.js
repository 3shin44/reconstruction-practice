import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
import BaseDialog from '../../../../src/components/common/BaseDialog.vue'

describe('共用元件燈箱(BaseDialog.vue)', () => {
  it('渲染 (mounted)', async () => {
    // 執行
    const wrapper = shallowMount(BaseDialog)
    // 驗證
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.modal').element.id).toBe(wrapper.vm.uuid)
  })
  it('渲染 (slots)', () => {
    // 執行
    const wrapper = shallowMount(BaseDialog, {
      slots: {
        header: '<div>Header</div>',
        body: '<div>Body</div>',
        footer: '<div>Footer</div>'
      }
    })
    // 驗證
    expect(wrapper.html()).toContain('<div>Header</div>')
    expect(wrapper.html()).toContain('<div>Body</div>')
    expect(wrapper.html()).toContain('<div>Footer</div>')
  })
  it('渲染 (Props.value)', async () => {
    // 準備
    let value = false
    // 執行
    const wrapper = shallowMount(BaseDialog, {
      propsData: { value }
    })
    // 驗證
    expect(wrapper.find('.modal').classes('show')).toBe(value)

    // 執行
    value = true
    await wrapper.setProps({ value })
    await wrapper.vm.$nextTick()
    // 驗證
    // jQ套件開啟好像沒這麼快?
    setTimeout(
      () => expect(wrapper.find('.modal').classes('show')).toBe(value),
      0
    )
  })
  it('渲染 (Props.closeButton)', async () => {
    // 準備
    let closeButton = false
    // 執行
    const wrapper = shallowMount(BaseDialog, {
      propsData: { closeButton }
    })
    // 驗證
    expect(wrapper.get('.modal-header button.close').isVisible()).toBe(
      closeButton
    )
    // 執行
    closeButton = true
    await wrapper.setProps({ closeButton })
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.modal-header button.close').isVisible()).toBe(
      closeButton
    )
  })
  it('點擊 關閉燈箱', () => {
    // 準備
    const closeButton = true
    // 執行
    const wrapper = shallowMount(BaseDialog, {
      propsData: { closeButton }
    })
    // 驗證
    wrapper.get('.modal-header button.close').trigger('click')
    expect(wrapper.find('.modal').classes('show')).toBe(false)
    expect(wrapper.vm.show).toBe(false)
  })
})
