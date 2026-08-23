

// export class Schema {
//   constructor(public definition: any) {}
// }

// class Model {
//   private collectionName: string;
//   private storageKey: string;

//   constructor(name: string, private schema: Schema) {
//     this.collectionName = name.toLowerCase();
//     this.storageKey = `mongoose_db_${this.collectionName}`;
//   }

//   private _getCollection(): any[] {
//     const data = localStorage.getItem(this.storageKey);
//     return data ? JSON.parse(data) : [];
//   }

//   private _setCollection(data: any[]) {
//     localStorage.setItem(this.storageKey, JSON.stringify(data));
//   }

//   async find(query: any = {}) {
//     const docs = this._getCollection();
//     return docs.filter(doc => {
//       return Object.keys(query).every(key => doc[key] === query[key]);
//     });
//   }

//   async findOne(query: any = {}) {
//     const docs = await this.find(query);
//     return docs[0] || null;
//   }

//   async findByIdAndDelete(id: string) {
//     const docs = this._getCollection();
//     const filtered = docs.filter(d => d._id !== id);
//     this._setCollection(filtered);
//   }

//   // Mimics the instantiation and save pattern
//   createDocument(data: any) {
//     const collection = this._getCollection();
    
//     // Internal save method attached to the doc
//     const save = async () => {
//       const currentCollection = this._getCollection();
//       const existingIndex = currentCollection.findIndex(d => d.ticker === data.ticker);
      
//       const doc = {
//         ...data,
//         _id: data._id || Math.random().toString(36).substr(2, 9),
//         updatedAt: new Date().toISOString(),
//         createdAt: data.createdAt || new Date().toISOString()
//       };

//       if (existingIndex > -1) {
//         currentCollection[existingIndex] = doc;
//       } else {
//         currentCollection.push(doc);
//       }
      
//       this._setCollection(currentCollection);
//       return doc;
//     };

//     return { ...data, save };
//   }
// }

// export const mongoose = {
//   Schema,
//   model: (name: string, schema: Schema) => new Model(name, schema)
// };
