class Lock {
    constructor() {
        this.setupDom();
        this.setupFlickity();
        this.setupAudio();
        this.onResize();
        this.listen();
        this.checkAuth(); // Add this line
    }

    // Add these new methods:
    async checkAuth() {
        try {
            const response = await fetch('/api/check-auth');
            const { verified } = await response.json();
            if (verified) window.location.href = '/portal';
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }

    async onChange() {
        this.sounds.select.play();
        this.code = this.getCode();
        this.dom.code.textContent = this.code;
        
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: this.code })
            });
            
            const { verified } = await response.json();
            
            if (verified) {
                this.handleSuccess();
                setTimeout(() => window.location.href = '/portal', 1000);
            } else {
                this.handleFailure();
            }
        } catch (error) {
            console.error('Verification failed:', error);
            this.handleFailure();
        }
    }

    handleSuccess() {
        this.verified = true;
        this.dom.lock.classList.add('verified');
        this.dom.status.textContent = 'UNLOCKED';
        this.sounds.success.play();
    }

    handleFailure() {
        this.verified = false;
        this.dom.lock.classList.remove('verified');
        this.dom.status.textContent = 'LOCKED';
        if (this.verified) this.sounds.fail.play();
    }

    // Keep all your existing methods below...
    // setupDom(), setupFlickity(), setupAudio(), etc.


  setupDom() {
    this.dom = {};
    this.dom.lock = document.querySelector('.lock');
    this.dom.rows = document.querySelectorAll('.row');
    this.dom.code = document.querySelector('.code');
    this.dom.status = document.querySelector('.status');
  }

  setupAudio() {
    this.sounds = {};

    this.sounds.select = new Howl({
      src: [
      'https://jackrugile.com/sounds/misc/lock-button-1.mp3',
      'https://jackrugile.com/sounds/misc/lock-button-1.ogg'],

      volume: 0.5,
      rate: 1.4 });


    this.sounds.prev = new Howl({
      src: [
      'https://jackrugile.com/sounds/misc/lock-button-4.mp3',
      'https://jackrugile.com/sounds/misc/lock-button-4.ogg'],

      volume: 0.5,
      rate: 1 });


    this.sounds.next = new Howl({
      src: [
      'https://jackrugile.com/sounds/misc/lock-button-4.mp3',
      'https://jackrugile.com/sounds/misc/lock-button-4.ogg'],

      volume: 0.5,
      rate: 1.2 });


    this.sounds.hover = new Howl({
      src: [
      'https://jackrugile.com/sounds/misc/lock-button-1.mp3',
      'https://jackrugile.com/sounds/misc/lock-button-1.ogg'],

      volume: 0.2,
      rate: 3 });


    this.sounds.success = new Howl({
      src: [
      'https://jackrugile.com/sounds/misc/lock-online-1.mp3',
      'https://jackrugile.com/sounds/misc/lock-online-1.ogg'],

      volume: 0.5,
      rate: 1 });


    this.sounds.fail = new Howl({
      src: [
      'https://jackrugile.com/sounds/misc/lock-fail-1.mp3',
      'https://jackrugile.com/sounds/misc/lock-fail-1.ogg'],

      volume: 0.6,
      rate: 1 });

  }

  setupFlickity() {
    for (let i = 0, len = this.dom.rows.length; i < len; i++) {
      let row = this.dom.rows[i];
      let flkty = new Flickity(row, {
        selectedAttraction: 0.25,
        friction: 0.9,
        cellAlign: 'center',
        pageDots: false,
        wrapAround: true });

      flkty.lastIndex = 0;

      flkty.on('select', () => {
        if (flkty.selectedIndex !== flkty.lastIndex) {
          this.onChange();
        }
        flkty.lastIndex = flkty.selectedIndex;
      });

      row.addEventListener('mouseenter', () => {
        this.sounds.hover.play();
      });
    }

    this.dom.prevNextBtns = this.dom.lock.querySelectorAll('.flickity-prev-next-button');
    for (let i = 0, len = this.dom.prevNextBtns.length; i < len; i++) {
      let btn = this.dom.prevNextBtns[i];
      btn.addEventListener('click', () => {
        if (btn.classList.contains('previous')) {
          this.sounds.prev.play();
        } else {
          this.sounds.next.play();
        }
      });
    }
  }}



let lock = new Lock();
