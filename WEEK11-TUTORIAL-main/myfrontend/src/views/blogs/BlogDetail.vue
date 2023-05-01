<template>
    <div class="container is-widescreen"  >
    <!-- <% if (error) { %> -->
        <section class="section" v-if="images.length == 0 && comments.length == 0">
        <div class="container is-widescreen">
            <div class="notification is-danger">
                <!-- {{ error.code + ': ' + error.sqlMessage }} -->
                <h1> FOLKKKKKKKKKKKKKKKKKKKKKKK</h1>
              <!-- <%= error.code + ': ' + error.sqlMessage %> -->
            </div>
          </div>
        </section>
    <!-- <% } else { %>   -->
    <div v-else>
        <section class="hero">
          <div class="hero-body">
            <p class="title">{{ blogs.title }}</p> 
          </div>
        </section>
        <section class="section" id="app">
            <div class="content">
                <div class="card has-background-light">
                    <div class="card-image pt-5">
                        <div class="columns">
                        <!-- <% for (image of images) { %> -->
                            <!-- <h1><%= image.file_path %></h1> -->
                        
                            <div class="column" v-for="image in images" :key="image.id" >
                                <figure class="image">
                                    <img :src="image.file_path ? image.file_path : 'https://bulma.io/images/placeholders/640x360.png'" alt="Placeholder image"> <!-- <%= image.file_path %>-->
                                </figure>
                            </div>
                        <!-- <% } %> -->
                            <!-- <div class="column">
                                <figure class="image">
                                    <img src="https://bulma.io/images/placeholders/480x480.png" alt="Placeholder image">
                                </figure>
                            </div>
                            <div class="column">
                                <figure class="image">
                                    <img src="https://bulma.io/images/placeholders/480x480.png" alt="Placeholder image">
                                </figure>
                            </div>
                            <div class="column">
                                <figure class="image">
                                    <img src="https://bulma.io/images/placeholders/480x480.png" alt="Placeholder image">
                                </figure>
                            </div> -->
                        </div>
                        
                    </div>
                    <div class="card-content">
                        <div class="content">
                            <!-- <%= blog.content %> -->
                            {{ blogs.content }}
                            
                        </div>
                        <div class="container">
                            <p class="subtitle">Comments</p>
    
                            <!-- <h1><%= console.log(comments) %></h1> -->
                                <!-- <% for (comment of comments) { %> -->
                                    <div class="box" v-for="comment of comments" :key="comment.id">
                                        <article class="media">
                                        <div class="media-left">
                                            <figure class="image is-64x64">
                                            <img :src="comment.file_path  ? comment.file_path : 'https://bulma.io/images/placeholders/640x360.png'" alt="Image">
                                            </figure>
                                        </div>
                                        <div class="media-content">
                                            <div class="content">
                                            <p>
                                                {{ comment.comment  }}
                                                <!-- <%= comment.comment %> -->
                                            </p>
                                            <p class="is-size-7">{{ comment.comment_date }}</p>   <!-- <%= comment.comment_date %>-->
                                            </div>
                                            <nav class="level is-mobile">
                                            <div class="level-left">
                                                <a class="level-item" aria-label="like">
                                                <span class="icon is-small">
                                                    <i class="fas fa-heart" aria-hidden="true"></i>
                                                </span>
                                                </a>
                                            </div>
                                            </nav>
                                        </div>
                                        </article>
                                    </div>
                                <!-- <% } %> -->
                             <!-- <%= `/${blog.id}/comments` %>-->
                                    <div class="columns box">
                                        <div class="column is-7">
                                            <input class="input" type="text" name="comment" placeholder="Comment here..." value="" v-model="comment">
                                        </div>
                                        <div class="column is-3">
                                            <div class="file">
                                                <label class="file-label">
                                                    <input class="file-input" type="file" id="file" ref="file" @change="handleFileUpload()">
                                                  <span class="file-cta">
                                                    <span class="file-icon">
                                                      <i class="fas fa-upload"></i>
                                                    </span>
                                                    <span class="file-label">
                                                      Choose an image…
                                                    </span>
                                                  </span>
                                                </label>
                                              </div>
                                        </div>
                                        <div class="column is-2">
                                            <input class="button is-primary" type="submit" value="Submit" @click="submit()">
                                        </div>
                                    </div>                         
                            
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a class="card-footer-item" href="/">To Home Page</a>
                    </footer>
                </div>
            </div>
        </section>
    </div>
    <!-- <% } %> -->
    </div>
</template>

<script>
import axios  from 'axios';
export default {
      data(){
        return{
            blogs : null,
            images : null,
            comments : null,
            comment: '',
            file: null
        }
      },
      created() {
        // axios.get("http://localhost:3000/")
        // .then((response) => {
        //   this.blogs = response.data;
        //   console.log(this.blogs)
        // })
        // .catch((err) => {
        //   console.log(err);
        // });

        axios.get(`http://localhost:3000/blogs/${this.$route.params.id}`)
        .then((response) => {
          this.blogs = response.data.blog;
          this.images = response.data.images;
          this.comments = response.data.comments;
        //   this.error = response.data;


          console.log(response.data)

        })
        .catch((err) => {
          console.log(err);
        });
      },
      methods: {
            handleFileUpload(){
                this.file = this.$refs.file.files[0];
                console.log(this.file)
            },
            submit(){
                var formData = new FormData();
                formData.append("blog_image", this.file);
                formData.append("comment", this.comment)
                axios.post(`http://localhost:3000/${this.$route.params.id}/comments`, formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    console.log(response.data)
                    location.reload()
                    // this.$router.push({path: '/'}) // Success! -> redirect to home page
                })
                .catch(error => {
                    console.log(error.message);
                });
            }
        }
}
</script>

<style>

</style>