export function throttle(milissegundos = 150) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  
      const metodoOriginal = descriptor.value;
  
      let timer = 0;
  
      descriptor.value = function (...args: any[]) {
        if (event) event.preventDefault();
        clearInterval(timer);
        timer = setTimeout(() => metodoOriginal.apply(this, args), milissegundos) as any;
      }
  
      return descriptor;
    }
  }
