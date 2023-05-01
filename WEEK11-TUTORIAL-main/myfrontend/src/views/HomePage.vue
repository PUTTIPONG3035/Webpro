<template>
      <div class="container is-widescreen">
      <section class="hero">
        <div class="hero-body">
          <p class="title">My Stories</p>

       
        </div>
      </section>
      <section class="section" id="app">
          <div class="content">
            <form method="GET" action="/">
            <div class="columns">
              <div class="column is-4 is-offset-2">
                <input class="input" type="text" name="search" placeholder="ค้นชื่อบทความ" value="" >
               
              </div>
              <div class="column is-2">
                <input class="button" type="submit" value="Search" >
              </div>
              <div class="column is-2">
                <router-link to="/blog/create">
                      <input class="button" type="button" value="Create New Blog">
                </router-link>
              </div>
            </div>
            </form>
          </div>
            <div class="columns is-multiline">
              <!-- <% for (let blog of blogs) { %> -->
                <div class="column is-3" v-for="blog in blogs" :key="blog.id">
                  <div class="card">
                    <h1>{{ blog.file_path }}</h1>
                      <div class="card-image pt-5">
                        <!-- <%= blog.file_path %> -->
                        <figure class="image">
                          <!-- <img src="<%= blog.file_path ? blog.file_path : 'https://bulma.io/images/placeholders/640x360.png' %>" alt="Placeholder image"> -->
                          <img :src="blog.file_path ? blog.file_path : 'https://bulma.io/images/placeholders/640x360.png'" alt="Placeholder image">
                          
                        </figure>
                      </div>
                      <div class="card-content">
                        <div class="title">{{ blog.title }} </div> <!-- <%= blog.title %> -->
                        <div class="content">
                            <span  v-if="blog.content.length > 200">
                                {{ blog.content.substring(0, 197) + "..." }}
                            </span>
                            <span v-else>
                                {{ blog.content }}
                            </span>
                          <!-- <% if (blog.content.length > 200) { %>
                            <%= blog.content.substring(0, 197) + "..." %>
                          <% } else { %>
                            <%= blog.content %>
                          <% } %> -->
                        </div>
                        
                      </div>
                      <footer class="card-footer">            
                        <router-link :to="{ name :'Blog Detail', params : { id : blog.id} }" class="card-footer-item" href="">Read more...</router-link> <!-- <%= `/blogs/${blog.id}/` %> -->
                        <a class="card-footer-item">
                          <form method="POST" action="" id="">  <!-- id :  form<%= blog.id %>      action: <%= `/blogs/addlike/${blog.id}` %>-->
                            <span class="icon-text"> <!-- form<%= blog.id %> -->
                              <span class="icon" @click="like(blog);">
                                <i class="far fa-heart"></i>
                              </span>
                              <span>Like {{ blog.like }} </span>  <!-- (<%= blog.like %>) -->
                            </span>
                          </form>
                        </a>
                      </footer>
                  </div>
                 

</div>
<!-- <% } %> -->
</div>
</section>
</div>
</template>

<script>
import axios  from 'axios';
export default {
    data(){
        return{
            blogs: null,
            search: this.$route.query.search,
            reSearch : null
        }
    },
    created() {
    axios.get("http://localhost:3000/", {params : {search : this.search}})
        .then((response) => {
          this.blogs = response.data.blogs;
          console.log(this.blogs)
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, 
    methods :{

        like(blog){
            console.log(blog)
            axios.post(`http://localhost:3000/blogs/addlike/${blog.id}`).then((res) =>{
                console.log( res)
                blog.like ++
                // location.reload()
            }).catch((err)=>{
                console.log(err);
            })
        },
        Search(){
            var formData = new FormData();
                formData.append("search", this.search);
            axios.post(`http://localhost:3000/blogs/search/${this.search}`, formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data'
                    }
                }).then((res)=>{
              
                    // this.reSearch = res.data
                    console.log(res.data)
                    // this.
                    // location.reload()
                }
           ).catch(error =>{
                console.log(error)
            })


            // var formData = new FormData();
            //     formData.append("blog_image", this.file);
            //     formData.append("title", this.title)
            //     formData.append("content", this.content)
            //     formData.append("status", this.status)
            //     formData.append("pinned", this.pinned)
            //     axios.post('http://localhost:3000/blogs', formData, {
            //         headers: {
            //         'Content-Type': 'multipart/form-data'
            //         }
            //     }).then(response => {
            //         console.log(response.data)
            //         this.$router.push({path: '/'}) // Success! -> redirect to home page
            //     })
            //     .catch(error => {
            //         console.log(error.message);
            //     });

        }
    }
}
</script>

<style scoped>

</style>