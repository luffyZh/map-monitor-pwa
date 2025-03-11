import { proxy } from 'valtio';

interface IGuardStore {
  visible: boolean;
  toggleVisible: () => void;
}
const state = proxy<IGuardStore>({
  visible: true,
  toggleVisible: () => {
    state.visible = !state.visible;
  },
});

export default state;
