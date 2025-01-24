import AbstractView from './abstractview.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);

    this.setTitle('xpcDeckTruco | Jogo');
  }

  getHtml() {
    console.log(this.params.id);

    return `
      <h1>oiii</h1>
      <p>123</p>    
    `;
  }
}