import '@testing-library/jest-dom/vitest';

// jsdom lacks <dialog> methods; stub them for navigation tests.
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal ??= function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close ??= function () {
    this.open = false;
  };
}
