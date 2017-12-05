// Copyright 2017 Jamie Hale
//
// This file is part of Tablescript.js.
//
// Tablescript.js is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Tablescript.js is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Tablescript.js. If not, see <http://www.gnu.org/licenses/>.

import chai from 'chai';
const expect = chai.expect;

import { valueTypes } from '../../src/values/types';
import { createBinaryExpression } from '../../src/parser/expressions';

describe('createBinaryExpression', () => {

  describe('evaluate', () => {
    describe('or', () => {
      describe('when left expression evaluates to true', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeBoolean: () => true
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, 'or', undefined);
          result = expression.evaluate({});
        })

        it('returns a boolean', () => {
          expect(result.type).to.equal(valueTypes.BOOLEAN);
        });

        it('returns true', () => {
          expect(result.asNativeBoolean()).to.be.true;
        });
      });

      describe('when left expression evaluates to false', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeBoolean: () => false
            })
          };
          const mockRightExpression = {
            evaluate: () => ({
              asNativeBoolean: () => false
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, 'or', mockRightExpression);
          result = expression.evaluate({});
        });

        it('returns a boolean', () => {
          expect(result.type).to.equal(valueTypes.BOOLEAN);
        });

        it('returns the right expression value', () => {
          expect(result.asNativeBoolean()).to.be.false;
        });
      });
    });

    describe('and', () => {
      describe('when left expression evaluates to false', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeBoolean: () => false
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, 'and', undefined);
          result = expression.evaluate({});
        })

        it('returns a boolean', () => {
          expect(result.type).to.equal(valueTypes.BOOLEAN);
        });

        it('returns false', () => {
          expect(result.asNativeBoolean()).to.be.false;
        });
      });

      describe('when left expression evaluates to true', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeBoolean: () => true
            })
          };
          const mockRightExpression = {
            evaluate: () => ({
              asNativeBoolean: () => true
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, 'or', mockRightExpression);
          result = expression.evaluate({});
        });

        it('returns a boolean', () => {
          expect(result.type).to.equal(valueTypes.BOOLEAN);
        });

        it('returns the right expression value', () => {
          expect(result.asNativeBoolean()).to.be.true;
        });
      });
    });

    describe('+', () => {
      describe('when left side is a string', () => {
        let mockLeftExpression;

        beforeEach(() => {
          mockLeftExpression = {
            evaluate: () => ({
              type: valueTypes.STRING,
              asNativeString: () => 'left value'
            })
          };
        });

        describe('when right side can be converted to a string', () => {
          let result;

          beforeEach(() => {
            const mockRightExpression = {
              evaluate: () => ({
                asNativeString: () => 'right value'
              })
            };
            const expression = createBinaryExpression({}, mockLeftExpression, '+', mockRightExpression);
            result = expression.evaluate();
          });

          it('returns a string', () => {
            expect(result.type).to.equal(valueTypes.STRING);
          });

          it('returns the left and right values concatenated', () => {
            expect(result.asNativeString()).to.equal('left valueright value');
          });
        });

        it('throws when the right side cannot be converted to a string', () => {
          const mockRightExpression = {
            evaluate: () => ({
              asNativeString: () => { throw new Error('Something went wrong'); }
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '+', mockRightExpression);
          expect(() => expression.evaluate()).to.throw('Something went wrong');
        });
      });

      describe('when left side is a number', () => {
        let mockLeftExpression;

        beforeEach(() => {
          mockLeftExpression = {
            evaluate: () => ({
              type: valueTypes.NUMBER,
              asNativeNumber: () => 12
            })
          };
        });

        describe('when right side can be converted to a number', () => {
          let result;

          beforeEach(() => {
            const mockRightExpression = {
              evaluate: () => ({
                type: valueTypes.NUMBER,
                asNativeNumber: () => 9
              })
            };
            const expression = createBinaryExpression({}, mockLeftExpression, '+', mockRightExpression);
            result = expression.evaluate({});
          });

          it('returns a number', () => {
            expect(result.type).to.equal(valueTypes.NUMBER);
          });

          it('returns the sum of the two numbers', () => {
            expect(result.asNativeNumber()).to.equal(21);
          });
        });

        it('throws when right side cannot be converted to a number', () => {
          const mockRightExpression = {
            evaluate: () => ({
              asNativeNumber: () => { throw new Error('Something went wrong'); }
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '+', mockRightExpression);
          expect(() => expression.evaluate()).to.throw('Something went wrong');
        });
      });

      it('throws when left side is not a string or a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            type: valueTypes.UNDEFINED
          })
        };
        const mockRightExpression = {
          evaluate: () => undefined
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '+', mockRightExpression);
        expect(() => expression.evaluate()).to.throw('Cannot add these values');
      });
    });

    describe('-', () => {
      it('throws if the left value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const mockRightExpression = {
          evaluate: () => undefined
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '-', mockRightExpression);
        expect(() => expression.evaluate()).to.throw('Something went wrong');
      });

      it('throws if the right value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '-', mockRightExpression);
        expect(() => expression.evaluate()).to.throw('Something went wrong');
      });

      describe('when both values are numeric', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeNumber: () => 9
            })
          };
          const mockRightExpression = {
            evaluate: () => ({
              asNativeNumber: () => 3
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '-', mockRightExpression);
          result = expression.evaluate();
        });

        it('returns a number', () => {
          expect(result.type).to.equal(valueTypes.NUMBER);
        });

        it('returns the difference between the two numbers', () => {
          expect(result.asNativeNumber()).to.equal(6);
        });
      });
    });

    describe('*', () => {
      it('throws if the left value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const mockRightExpression = {
          evaluate: () => undefined
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '*', mockRightExpression);
        expect(() => expression.evaluate()).to.throw('Something went wrong');
      });

      it('throws if the right value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '*', mockRightExpression);
        expect(() => expression.evaluate()).to.throw('Something went wrong');
      });

      describe('when both values are numeric', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeNumber: () => 9
            })
          };
          const mockRightExpression = {
            evaluate: () => ({
              asNativeNumber: () => 3
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '*', mockRightExpression);
          result = expression.evaluate();
        });

        it('returns a number', () => {
          expect(result.type).to.equal(valueTypes.NUMBER);
        });

        it('returns the product of the two numbers', () => {
          expect(result.asNativeNumber()).to.equal(27);
        });
      });
    });

    describe('/', () => {
      it('throws if the left value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '/', mockRightExpression);
        expect(() => expression.evaluate()).to.throw('Something went wrong');
      });

      it('throws if the right value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '/', mockRightExpression);
        expect(() => expression.evaluate()).to.throw('Something went wrong');
      });

      it('throws if the right value is 0', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => 0
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '/', mockRightExpression);
        expect(() => expression.evaluate()).to.throw('Divide by zero');
      });

      describe('when both values are numeric', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeNumber: () => 27
            })
          };
          const mockRightExpression = {
            evaluate: () => ({
              asNativeNumber: () => 9
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '/', mockRightExpression);
          result = expression.evaluate();
        });

        it('returns a number', () => {
          expect(result.type).to.equal(valueTypes.NUMBER);
        });

        it('returns the first divided by the second', () => {
          expect(result.asNativeNumber()).to.equal(3);
        });
      });
    });

    describe('%', () => {
      it('throws if the left value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '%', mockRightExpression);
        expect(() => expression.evaluate()).to.throw('Something went wrong');
      });

      it('throws if the right value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '%', mockRightExpression);
        expect(() => expression.evaluate()).to.throw('Something went wrong');
      });

      it('throws if the right value is 0', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => 0
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '%', mockRightExpression);
        expect(() => expression.evaluate()).to.throw('Divide by zero');
      });

      describe('when both values are numeric', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeNumber: () => 27
            })
          };
          const mockRightExpression = {
            evaluate: () => ({
              asNativeNumber: () => 5
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '%', mockRightExpression);
          result = expression.evaluate();
        });

        it('returns a number', () => {
          expect(result.type).to.equal(valueTypes.NUMBER);
        });

        it('returns the first modulo the second', () => {
          expect(result.asNativeNumber()).to.equal(2);
        });
      });
    });

    describe('==', () => {
      it('defers to the equals method', () => {
        const leftExpression = {
          evaluate: () => ({
            equals: () => true
          })
        };
      });
    });

    it('throws when given an unrecognized operator', () => {
      const expression = createBinaryExpression({}, undefined, 'not defined', undefined);
      expect(() => expression.evaluate()).to.throw('Invalid operator not defined');
    });
  });

  it('throws when evaluated as lhs', () => {
    const expression = createBinaryExpression({}, '', {});
    expect(() => expression.evaluateAsLeftHandSide()).to.throw('Cannot assign to binary expression');
  });

  describe('getReferencedSymbols', () => {
    it('mixes the results of delegating to each of lhs and value expressions', () => {
      const mockLeftExpression = {
        getReferencedSymbols: () => [2, 4],
      };
      const mockRightExpression = {
        getReferencedSymbols: () => [1, 3],
      };
      const expression = createBinaryExpression({}, mockLeftExpression, '', mockRightExpression);
      expect(expression.getReferencedSymbols()).to.eql([2, 4, 1, 3]);
    });
  });
});
