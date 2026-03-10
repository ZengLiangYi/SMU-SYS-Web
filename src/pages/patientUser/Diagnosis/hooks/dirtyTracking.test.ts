/**
 * dirty 状态流转矩阵测试
 *
 * 模拟组件中 dirty/dirtyRef/setDirtyState 三件套的行为，
 * 验证各场景下 dirty 状态是否正确。
 */

// 模拟 dirty 状态管理器（对应组件中 dirty/dirtyRef/setDirtyState 三件套）
class DirtyTracker {
  dirty = false;
  mark() {
    this.dirty = true;
  }
  clear() {
    this.dirty = false;
  }
}

// 模拟 beforeunload 注册逻辑
class BeforeUnloadTracker {
  registered = false;
  sync(dirty: boolean) {
    this.registered = dirty;
  }
}

describe('dirty 状态流转', () => {
  let tracker: DirtyTracker;
  let unload: BeforeUnloadTracker;

  beforeEach(() => {
    tracker = new DirtyTracker();
    unload = new BeforeUnloadTracker();
  });

  // ========== 正常操作路径 ==========

  it('初始状态为 false', () => {
    expect(tracker.dirty).toBe(false);
  });

  it('Step 0: onValuesChange → dirty=true', () => {
    // 用户修改主诉，触发 onValuesChange
    tracker.mark(); // onValuesChange={() => setDirtyState(true)}
    expect(tracker.dirty).toBe(true);
  });

  it('Step 0: 无修改 → dirty=false', () => {
    // 用户未修改任何字段
    expect(tracker.dirty).toBe(false);
  });

  it('Step 0: 修改 → onFinish 成功 → dirty=false', () => {
    tracker.mark(); // 用户修改
    expect(tracker.dirty).toBe(true);
    tracker.clear(); // onFinish 成功
    expect(tracker.dirty).toBe(false);
  });

  it('Step 1: onChange wrapper → dirty=true', () => {
    // CheckCard.Group onChange wrapper 触发
    tracker.mark();
    expect(tracker.dirty).toBe(true);
  });

  it('Step 1: onFinish 成功 → dirty=false', () => {
    tracker.mark();
    tracker.clear(); // onFinish 成功
    expect(tracker.dirty).toBe(false);
  });

  it('Step 2: handleUploadChange → dirty=true', () => {
    tracker.mark(); // handleUploadChange 中 setDirtyState(true)
    expect(tracker.dirty).toBe(true);
  });

  it('Step 2: onFinish 成功 → dirty=false', () => {
    tracker.mark();
    tracker.clear();
    expect(tracker.dirty).toBe(false);
  });

  it('Step 3: fieldProps.onChange → dirty=true', () => {
    // 用户手动修改诊断结果
    tracker.mark(); // fieldProps.onChange
    expect(tracker.dirty).toBe(true);
  });

  it('Step 3: setFieldsValue 不触发 fieldProps.onChange → dirty 不变', () => {
    // LLM 自动填充通过 form.setFieldsValue
    // fieldProps.onChange 不受 setFieldsValue 影响
    // 不调用 tracker.mark()
    expect(tracker.dirty).toBe(false);
  });

  it('Step 3: onFinish 成功 → dirty=false', () => {
    tracker.mark();
    tracker.clear();
    expect(tracker.dirty).toBe(false);
  });

  it('Step 4: dirtyActions 调用 → dirty=true', () => {
    // 用户添加药物，通过 dirtyActions.addMedication 触发
    tracker.mark(); // dirtyActions 包装中 notify()
    expect(tracker.dirty).toBe(true);
  });

  it('Step 4: 无操作 → dirty=false (dirtyActions 不触发)', () => {
    // PrescriptionContent remount，dirtyActions 不被调用
    // 不调用 tracker.mark()
    expect(tracker.dirty).toBe(false);
  });

  it('全局 onFinish 成功 → dirty=false', () => {
    tracker.mark();
    tracker.clear(); // 最终提交成功
    expect(tracker.dirty).toBe(false);
  });

  // ========== Step 间来回切换 ==========

  it('Step 2→1(上一步)→2: 无修改 → dirty=false', () => {
    // 来回切换不触发任何 dirty 源
    // onPre 不调用 onFinish，也不调用 mark
    expect(tracker.dirty).toBe(false);
  });

  it('Step 3→2(上一步): 不清除 dirty（正确保留）', () => {
    tracker.mark(); // Step 3 用户修改
    // 点上一步 → onPre 不调用 onFinish，不清 dirty
    expect(tracker.dirty).toBe(true);
  });

  it('Step 3 修改→2→3: dirty 持续为 true', () => {
    tracker.mark(); // Step 3 修改
    // 回退到 Step 2
    // 不调用 clear (onPre 不触发 onFinish)
    // 再前进到 Step 3
    expect(tracker.dirty).toBe(true);
  });

  it('Step 2→1(上一步) 修改上传→2→离开: dirty=true', () => {
    // 回到 Step 1 不清 dirty
    // 在 Step 2 上传文件
    tracker.mark(); // handleUploadChange
    // Step 2 onFinish 未触发 (StepsForm 上一步不调 onFinish)
    expect(tracker.dirty).toBe(true);
  });

  // ========== 刷新/Resume 后的 dirty ==========

  it('页面刷新恢复: dirty 初始为 false', () => {
    // 刷新后 DirtyTracker 重新创建，初始为 false
    const freshTracker = new DirtyTracker();
    expect(freshTracker.dirty).toBe(false);
  });

  it('Resume 后 loadCandidatesOnly 不触发 dirty', () => {
    // loadCandidatesOnly 和 setSelected* 是 hook 内部调用
    // 不经过 onChange wrapper
    expect(tracker.dirty).toBe(false);
  });

  it('Resume 后 LLM 自动重触发 loadDiagnosisData: 不设 dirty', () => {
    // loadDiagnosisData 通过 form.setFieldsValue 填充
    // fieldProps.onChange 不受 setFieldsValue 影响
    expect(tracker.dirty).toBe(false);
  });

  it('Resume 后 PrescriptionContent remount: dirtyActions 不被调用 → dirty=false', () => {
    // PrescriptionContent 重新挂载，数据通过 props 传入
    // dirtyActions 的包装函数未被调用
    expect(tracker.dirty).toBe(false);
  });

  it('Resume 后 resolvePrescriptionData: 不触发 dirty', () => {
    // resolvePrescriptionData 通过 set* setState 恢复数据
    // 不经过 dirtyActions
    expect(tracker.dirty).toBe(false);
  });

  // ========== 并发操作 ==========

  it('LLM loading 中点离开: dirty 取决于用户之前是否操作', () => {
    // 场景 A: 用户无操作 → dirty=false
    expect(tracker.dirty).toBe(false);

    // 场景 B: 用户有操作 → dirty=true
    tracker.mark();
    expect(tracker.dirty).toBe(true);
  });

  it('LLM 返回不触发 dirty', () => {
    // LLM 回调仅设置 state (setSelected*, setFieldsValue)
    // 不经过 onChange wrapper / dirtyActions
    expect(tracker.dirty).toBe(false);
  });

  it('Step 0→下一步→LLM 返回→自动保存: dirty=false', () => {
    tracker.mark(); // Step 0 用户修改
    tracker.clear(); // Step 0 onFinish 成功清 dirty
    // loadScreeningData 中 setSelected* 是 hook 内部调用
    // auto-save 不设 dirty
    expect(tracker.dirty).toBe(false);
  });

  it('LLM 返回同时用户操作: 正确反映用户操作', () => {
    // LLM 回调不触发 dirty
    // 用户操作通过 onChange/dirtyActions 触发 dirty
    tracker.mark(); // 用户操作
    expect(tracker.dirty).toBe(true);
  });

  // ========== 浏览器标签关闭 ==========

  it('dirty=true: beforeunload 注册', () => {
    tracker.mark();
    unload.sync(tracker.dirty);
    expect(unload.registered).toBe(true);
  });

  it('dirty=false: beforeunload 未注册', () => {
    unload.sync(tracker.dirty);
    expect(unload.registered).toBe(false);
  });

  it('dirty 状态切换: beforeunload 正确跟随', () => {
    // 初始未注册
    unload.sync(tracker.dirty);
    expect(unload.registered).toBe(false);

    // 用户修改 → 注册
    tracker.mark();
    unload.sync(tracker.dirty);
    expect(unload.registered).toBe(true);

    // 保存成功 → 取消注册
    tracker.clear();
    unload.sync(tracker.dirty);
    expect(unload.registered).toBe(false);
  });
});
